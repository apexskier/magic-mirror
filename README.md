# Magic Mirror

One of many, this one by apexskier.

## Running

Three things are run: the central server, the python opencv component, and the
client (chromium).

Following everything in my setup notes should bring all this up on boot.

## Setup notes

I started with base image of [Raspbian Jessie Light](https://www.raspberrypi.org/downloads/raspbian/).

**Install tools**

```sh
sudo apt-get update
sudo apt-get install git vim openbox-session tmux terminator
```

**Clone Project**

`git clone git@github.com:apexskier/magic-mirror`

Make sure this is cloned in the login user's homedir.

**Update Configuration Files**

Each file in the `raspbian` directory should be linked or copied to it's
real location (second line in each file).

**Setup Auto Login**

http://elinux.org/RPi_Debian_Auto_Login

**Install Web Browser**

`sudo apt-get install iceweasel`

http://conoroneill.net/running-the-latest-chromium-45-on-debian-jessie-on-your-raspberry-pi-2/

**Install OpenCV**

I used python 3 for everything.

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
overscan_top=186
overscan_bottom=230
display_rotate=1
```

`/etc/kbd/config`

```
BLANK_TIME=0
POWERDOWN_TIME=0
```

**Install Unclutter**

`sudo apt-get install libev-dev`

https://github.com/Airblader/unclutter-xfixes

I had to hack the makefile to disable man page generation. Even after installing
asciidocs there were failures when linting the xml file.

## Dev Resources

[OpenCV Motion Tracking](https://github.com/pageauc/motion-track/blob/master/motion3-track.py)
