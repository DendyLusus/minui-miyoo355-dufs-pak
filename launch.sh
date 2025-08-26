#!/bin/sh

cd "$(dirname "$0")"

DUFS_PID="$(pidof dufs)"

if [ -n "$DUFS_PID" ]; then
    killall dufs &
    show.elf res/disable.png 2
else
    ./dufs -b 0.0.0.0 -p 65080 --hidden '.*' -A /mnt/sdcard/ &
    show.elf res/enable.png 4
fi

exit 0