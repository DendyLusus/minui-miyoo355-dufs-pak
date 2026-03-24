#!/bin/sh

cd "$(dirname "$0")"

dufs_pid=$(pidof dufs)

if [ -n "$dufs_pid" ]; then
    kill "$dufs_pid" 2>/dev/null
    show.elf res/disable.png 2
else
    if [ "$(cat /sys/class/net/wlan0/operstate 2>/dev/null)" != "up" ]; then
        show.elf res/disable.png 2
        exit 1
    fi

    ./dufs -b 0.0.0.0 -p 65080 --hidden '.*' --assets res/ -A "${SDCARD_PATH:-/mnt/sdcard}/" &
    dufs_pid=$!
    sleep 0.3

    if kill -0 "$dufs_pid" 2>/dev/null; then
        show.elf res/enable.png 4
    else
        show.elf res/disable.png 2
        exit 1
    fi
fi