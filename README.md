# Magic Mirror

One of many, this one by apexskier.

## Assorted setup notes

**Install Chromium**

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
