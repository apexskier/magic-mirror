# Magic Mirror

One of many, this one by apexskier.

## Running

You'll need to run three things: the central server, the python opencv component,
and the client (chromium).

Each runs in its own process, so hook it up how you need to to run all three

```sh
node src/server.js   # server
./kiosk.sh           # client
./eyes/main.py       # opencv
```

## Assorted setup notes

**Install Web Browser**

`sudo apt-get install iceweasel`

http://conoroneill.net/running-the-latest-chromium-45-on-debian-jessie-on-your-raspberry-pi-2/

**Install OpenCV**

http://www.pyimagesearch.com/2015/10/26/how-to-install-opencv-3-on-raspbian-jessie/

**OpenCV Raspberry Pi camera**

http://www.pyimagesearch.com/2015/03/30/accessing-the-raspberry-pi-camera-with-opencv-and-python/

**Install Node**

For the Raspberry Pi 2, use the ARMv7 node build.

https://nodejs.org/en/download/stable/

**Configure Display**

`/boot/config.txt`

```
overscan_left=35
overscan_right=30
overscan_top=200
overscan_bottom=217
display_rotate=1
```

`/etc/kbd/config`

```
BLANK_TIME=0
POWERDOWN_TIME=0
```

## Dev Resources

[OpenCV Motion Tracking](https://github.com/pageauc/motion-track/blob/master/motion3-track.py)
