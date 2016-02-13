import argparse
import logging
from os import path
import signal
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

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.DEBUG)

resolution = (320, 240)
api_root = 'http://localhost:8102'

# initialize camera
print('initializing camera...')
camera = PiCamera()
camera.resolution = resolution
camera.framerate = 30 # max framerate
rawCapture = PiRGBArray(camera, size=resolution)
# give camera time to start up
time.sleep(0.1)
capture = cv2.VideoCapture(0)

face_cascade = cv2.CascadeClassifier(path.join(path.dirname(__file__), 'haarcascade_frontalface_default.xml'))

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

    def __call__(self):
        now = time.time()
        if now - self.last_called > self.min_time:
            self.func()
            self.last_called = now


print('starting socketio...')
io = SocketIO('localhost', 8101)
io_namespace = io.define(BaseNamespace, '/vision')


# continous data
first_frame = True
seeing_face = 0
last_seen_face = 0
first_saw_face = 0
last_action = 0
last_fps = 0


print('starting capture...')
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    now = time.time()
    if not running:
        break

    image = frame.array
    if args.preview:
        preview = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # face detection
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    num_faces = len(faces)
    if num_faces:
        io_namespace.emit('faces', [{
            'x': x,
            'y': y,
            'w': w,
            'h': h
        } for (x, y, w, h) in faces])

        if args.preview:
            for (x, y, w, h) in faces:
                cv2.rectangle(preview, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # Record some data about the face being seen
        last_seen_face = now
        if not seeing_face:
            first_saw_face = now
            logging.info('{} Face{} found', num_faces, 's' if num_faces == 1 else '')
        seeing_face = num_faces
    else:
        # timeout for a face to really be gone
        # this accounts for not recognizing a face for a frame or two at a time
        if now - last_seen_face > 1:
            if seeing_face:
                logging.info('Face lost')
            seeing_face = 0

    if first_frame:
        fps = None
    else:
        frame_time = now - last_frame_time
        if fps is None:
            fps = frame_time
        else:
            fps = (fps + frame_time) / 2

        if now - last_fps > 1:
            logging.debug('fps: {}'.format(1 / frame_time))
            last_fps = now

        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        print(hist.shape)
        (means, stds) = cv2.meanStdDev(image)

    if args.preview:
        cv2.imshow('Preview', preview)
        #if not first_frame:
        #    cv2.imshow('Data', diff_image)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        running = False

    first_frame = False
    last_frame_time = now
    fps = 0
    last_image = image.copy()
    # clear the stream for next frame
    rawCapture.truncate(0)

