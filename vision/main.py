import argparse
import logging
from os import path
import signal
import subprocess
import sys
import time

import cv2
import numpy as np
from picamera.array import PiRGBArray
from picamera import PiCamera
from socketIO_client import SocketIO, BaseNamespace

parser = argparse.ArgumentParser(description='Do fancy OpenCV stuff')
parser.add_argument('--preview', action='store_true')
args = parser.parse_args()

logging.basicConfig(format='[%(levelname)s|%(asctime)s] %(message)s', level=logging.WARNING, datefmt="%Y-%m-%d %H:%M:%S")
logger = logging.getLogger('magicmirror')
logger.setLevel(logging.INFO)

logger.info('starting socketio...')
io = SocketIO('localhost', 8101)
io_namespace = io.define(BaseNamespace, '/vision')

resolution = (320, 240)
box_size = (.3, .5)
box_w = int(box_size[0] * resolution[0])
box_h = int(box_size[1] * resolution[1])
box_x = int((resolution[0] - box_w) / 2)
box_y = int((resolution[1] - box_h) / 2)
box_top_left = (box_x, box_y)
box_bot_right = (box_w + box_x, box_h + box_y)

current_dir = path.dirname(__file__)
face_cascade = cv2.CascadeClassifier(path.join(current_dir, 'haarcascade_frontalface_default.xml'))

# enable safe shutdown with ctl+c
global running
running = True

def signal_handler(signal, frame):
    global running
    running = False

signal.signal(signal.SIGINT, signal_handler)


class MotionObject(object):
    """
    Super simple tracking of a point over time
    """
    def __init__(self):
        now = time.time()
        self.last_hit = now
        self.last_point = None
        self.initialized = now
        self.average_point = None

    def reset(self):
        self.last_hit = now
        self.last_point = None
        self.average_point = None
        self.initialized = now

    def hit(self, point, now=None):
        if now is None:
            now = time.time()
        self.last_hit = now
        self.last_point = point

        # running average, weighted towards most recent
        x = point[0]
        y = point[1]

        if self.average_point is None:
            self.average_point = (x, y)
        else:
            avg_x = (self.average_point[0] + x) / 2
            avg_y = (self.average_point[1] + y) / 2
            self.average_point = (avg_x, avg_y)

    def active_for(self, now=None):
        if now is None:
            now = time.time()
        return now - self.initialized

    def inactive_for(self):
        return time.time() - self.last_hit

    def diff_from_mean(self, point=None):
        if point is None:
            point = self.last_point
        if point is None:
            return None
        return (point[0] - self.average_point[0],
                point[1] - self.average_point[1])


class RateLimit(object):
    """
    Initialize with a function to be called. Calling this object calls the
    function a maximum of once every min_time.
    """
    def __init__(self, func, min_time=1):
        self.min_time = min_time
        self.func = func
        self.last_called = 0 # forever ago

    def __call__(self, *args, **kwargs):
        now = time.time()
        if now - self.last_called > self.min_time:
            self.func(*args, **kwargs)
            self.last_called = now


class WaitLimit(RateLimit):
    """
    Same functionality as RateLimit, but it sets timeout every time called.
    This means the delay between any execution is greater than time.
    """
    def __call__(self, *args, **kwargs):
        now = time.time()
        if now - self.last_called > self.min_time:
            self.func(*args, **kwargs)
        self.last_called = now


def _fpsLogger(t):
    logger.debug('fps: {}'.format(1 / t))
fpsLogger = RateLimit(_fpsLogger, 5)

def _wave():
    logger.info('gesture')
    io_namespace.emit('gesture', {'type': 'generic'})
wave = WaitLimit(_wave, 2)

def _wakeTv():
    # if someone looks at this in the middle of the night, turn on and let cron
    # turn it off at the next opportunity
    subprocess.call(' '.join([path.join(current_dir, '..', 'scripts', 'tv.sh'), 'on']), shell=True)
wakeTv = WaitLimit(_wakeTv, 60)

# continous data
first_frame = True
seeing_face = 0
last_seen_face = 0
first_saw_face = 0
last_action = 0
last_fps = 0

# initialize camera
logger.info('initializing camera...')
with PiCamera() as camera:
    # give camera time to start up
    time.sleep(1)

    camera.resolution = resolution
    camera.framerate = 30 # max framerate

    with PiRGBArray(camera, size=resolution) as stream:
        logger.info('starting capture...')
        for frame in camera.capture_continuous(stream, format="bgr", use_video_port=True):
            now = time.time()
            if not running:
                break

            image = frame.array
            if args.preview:
                preview = image.copy()
                cv2.rectangle(preview, box_top_left, box_bot_right, (0, 255, 0), 1)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) # img[y: y + h, x: x + w]

            # face detection
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            num_faces = len(faces)
            if num_faces:
                io_namespace.emit('faces', [{
                    'x': x / resolution[0],
                    'y': y / resolution[1],
                    'w': w / resolution[0],
                    'h': h / resolution[1]
                } for (x, y, w, h) in faces])

                if args.preview:
                    for (x, y, w, h) in faces:
                        cv2.rectangle(preview, (x, y), (x + w, y + h), (255, 0, 0), 2)

                # Record some data about the face being seen
                last_seen_face = now
                if not seeing_face:
                    first_saw_face = now
                if seeing_face != num_faces:
                    logger.info('{} face{} found'.format(num_faces, '' if num_faces == 1 else 's'))
                seeing_face = num_faces
                wakeTv()
            else:
                # timeout for a face to really be gone
                # this accounts for not recognizing a face for a frame or two at a time
                if now - last_seen_face > 1:
                    if seeing_face:
                        logger.info('face lost')
                    seeing_face = 0

            if first_frame:
                fps = None
            else:
                frame_time = now - last_frame_time
                if fps is None:
                    fps = frame_time
                else:
                    fps = (fps + frame_time) / 2
                fpsLogger(frame_time)

                box_image = image[box_top_left[1]:box_bot_right[1], box_top_left[0]:box_bot_right[0]]
                (means, stds) = cv2.meanStdDev(box_image)
                stdsum = int(np.sum(stds))
                # print('|-{} {}'.format(''.join(['-'] * int(stdsum / 10)), stdsum))
                if seeing_face:
                    if stdsum < 10:
                        wave()

            if args.preview:
                cv2.imshow('Preview', preview)
                #if not first_frame:
                #    cv2.imshow('Data', diff_image)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                running = False

            first_frame = False
            last_frame_time = now
            fps = 0
            # clear the stream for next frame
            stream.seek(0)
            stream.truncate()

