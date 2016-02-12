import argparse
from os import path
import signal
import sys
import time

import cv2
import numpy as np
from picamera.array import PiRGBArray
from picamera import PiCamera
import requests
from socketIO_client import SocketIO, BaseNamespace

parser = argparse.ArgumentParser(description='Do fancy OpenCV stuff')
parser.add_argument('--preview', action='store_true')
args = parser.parse_args()

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

kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

# continous data
first_frame = True
seeing_face = False
last_seen_face = 0
first_saw_face = 0
last_action = 0

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
    def __init__(self, func, min_time=2):
        self.min_time = min_time
        self.func = func
        self.last_called = 0 # forever ago

    def __call__(self):
        now = time.time()
        if now - self.last_called > self.min_time:
            self.func()
            self.last_called = now


def activate_function():
    try:
        requests.post(api_root + '/activate')
    except Exception:
        pass
activate = RateLimit(activate_function)


print('starting socketio...')
io = SocketIO('localhost', 8101)
io_namespace = io.define(BaseNamespace, '/vision')


print('starting capture...')
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    if not running:
        break

    now = time.time()
    image = frame.array
    if args.preview:
        preview = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)

    # face detection
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces):
        activate()
        for (x, y, w, h) in faces:
            if args.preview:
                cv2.rectangle(preview, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # Record some data about the face being seen
        last_seen_face = now
        if not seeing_face:
            first_saw_face = now
            print("seeing_face")
            seeing_face = True
            active_object = MotionObject()
    else:
        # 2 second timeout for a face to really be gone
        # this accounts for not recognizing a face for a frame or two at a time
        if now - last_seen_face > 1:
            if seeing_face:
                print("not seeing face")
                seeing_face = False
                active_object = None

    if first_frame:
        first_image = cv2.dilate(edges.copy(), kernel, iterations=1)
        last_image = first_image.copy()
    else:
        # motion detection
        # motion is a change in contours over time
        # We use the first ever and previous frame's contours as a mask.
        # Differences are treated as new motion
        # edges are dialated to ensure overlap
        mask_image = edges.copy()
        cv2.bitwise_or(first_image, last_image, mask_image)
        cv2.bitwise_not(mask_image, mask_image)
        diff_image = cv2.bitwise_and(mask_image, edges)

        last_image = cv2.dilate(edges.copy(), kernel, iterations=1)

        _, contours, _ = cv2.findContours(diff_image.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        largest = None
        largest_area = 0
        for c in contours:
            area = cv2.contourArea(c)
            if area > largest_area:
                largest_area = area
                largest = c
            if args.preview:
                (x, y, w, h) = cv2.boundingRect(c)
                cv2.rectangle(preview, (x, y), (x + w, y + h), (0, 155, 0), 1)

        if largest is not None and largest_area > 10:
            (x, y, w, h) = cv2.boundingRect(largest)
            cx = int(x + w/2)
            cy = int(y)
            if args.preview:
                cv2.circle(preview, (cx, cy), min(w, h), (0, 255, 0), 2)

            io_namespace.emit('tracking', {
                'x': cx / resolution[0],
                'y': cy / resolution[1]
            })

        if seeing_face:
            if largest is not None and largest_area > 10 and now - first_saw_face > 1:
                active_object.hit((cx, cy))
            else:
                if active_object.inactive_for() > 1:
                    active_object.reset()

            if now - last_action > 3:
                diff = active_object.diff_from_mean()
                # Mirrors invert direction
                if diff is not None:
                    if diff[0] > 20:
                        print("slide left")
                        try:
                            requests.post(api_root + '/gesture/left')
                        except Exception:
                            pass
                        last_action = now
                    elif diff[0] < -20:
                        print("slide right")
                        try:
                            requests.post(api_root + '/gesture/right')
                        except Exception:
                            pass
                        last_action = now

        # fps = capture.get(cv2.CAP_PROP_FPS)
        # cv2.putText(preview, str(fps), (40, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA, True)

    if args.preview:
        cv2.imshow('Preview', preview)
        if not first_frame:
            cv2.imshow('Edges', diff_image)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        running = False

    first_frame = False
    # clear the stream for next frame
    rawCapture.truncate(0)

