#!/bin/bash

STATUS=`tvservice -s | cut -d' ' -f2`

case "$1" in
    on)
        case "$STATUS" in
            "0x120006") # on?
                # pass
                ;;
            "0x120002"|*) # off
                tvservice -p
        esac
        ;;
    off)
        case "$STATUS" in
            "0x120002") # off
                # pass
                ;;
            "0x120006"|*) # on?
                tvservice -o
        esac
        ;;
    *)
        echo "Usage: $0 [off|on]"
        exit 1
esac
