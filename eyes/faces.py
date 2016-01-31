from picamera.array import PiRGBArray
from picamera import PiCamera
import numpy as np
import cv2
import time
import requests

camera = PiCamera()
resolution = (640, 480)
camera.resolution = resolution
camera.framerate = 30
rawCapture = PiRGBArray(camera, size=resolution)

# give camera time to start up
time.sleep(0.1)

capture = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

class RateLimit(object):
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
    print('activating')
    requests.post('http://localhost:8102/activate')

activate = RateLimit(activate_function)

for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    image = frame.array
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2)

    if len(faces):
        activate()

    cv2.imshow('Preview', image)

    # clear the stream for next frame
    rawCapture.truncate(0)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

