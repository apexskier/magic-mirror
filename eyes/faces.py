from picamera.array import PiRGBArray
from picamera import PiCamera
import numpy as np
import argparse
import cv2
import time
import requests
import signal
import sys

parser = argparse.ArgumentParser(description='Do fancy OpenCV stuff')
parser.add_argument('--preview', action='store_true')
args = parser.parse_args()

camera = PiCamera()
resolution = (320, 240)
camera.resolution = resolution
camera.framerate = 30 # max framerate
rawCapture = PiRGBArray(camera, size=resolution)

# give camera time to start up
time.sleep(0.1)

capture = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

fgbg = cv2.createBackgroundSubtractorMOG2(detectShadows=False)

# Setup SimpleBlobDetector parameters.
params = cv2.SimpleBlobDetector_Params()

params.minThreshold = 5;
params.maxThreshold = 300;

params.filterByArea = True
params.minArea = 200

params.filterByCircularity = False
params.filterByConvexity = False
params.filterByInertia = False

# Create a detector with the parameters
blob_detector = cv2.SimpleBlobDetector_create(params)

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
    try:
        requests.post('http://localhost:8102/activate')
    except Exception: # TODO: More specific
        print("Failed to contact server.")

activate = RateLimit(activate_function)

global running
running = True

def signal_handler(signal, frame):
    global running
    running = False

signal.signal(signal.SIGINT, signal_handler)

first = True
seeing_face = False
last_seen_face = 0
first_saw_face = 0

gesture_keypoints = []

for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    if not running:
        break
    now = time.time()
    image = frame.array
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    mask = fgbg.apply(gray)
    masked = cv2.bitwise_and(gray, gray, mask=mask)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if args.preview:
        preview = cv2.bitwise_and(image, image, mask=mask)
        for (x, y, w, h) in faces:
            cv2.rectangle(preview, (x, y), (x + w, y + h), (255, 0, 0), 2)

    if len(faces):
        activate()
        last_seen_face = now
        if not seeing_face:
            first_saw_face = now
            print("seeing_face")
            seeing_face = True
    else:
        if now - last_seen_face > 2:
            if seeing_face:
                print("not seeing face")
                seeing_face = False

    if seeing_face:
        # give the person a couple seconds to settle down after being seen
        if now - first_saw_face < 2:
            pass
        else:
            keypoints = blob_detector.detect(masked)

            print(list(map(lambda k: k.pt, keypoints)))
            # Draw detected blobs as red circles.
            # cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS ensures the size of the circle corresponds to the size of blob
            if args.preview:
                preview = cv2.drawKeypoints(preview, keypoints, np.array([]), (0, 0, 255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)

    # fps = capture.get(cv2.CAP_PROP_FPS)
    # cv2.putText(preview, str(fps), (40, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA, True)

    if args.preview:
        cv2.imshow('Preview', preview)

    # clear the stream for next frame
    rawCapture.truncate(0)
    first = False

    if cv2.waitKey(1) & 0xFF == ord('q'):
        running = False

