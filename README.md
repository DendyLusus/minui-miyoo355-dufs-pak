# minui-miyoo355-dufs-pak

A simple [MinUI PAK](https://github.com/shauninman/MinUI/blob/main/PAKS.md) that brings the [dufs file server](https://github.com/sigoden/dufs) to the Miyoo Flip. Transfer files wirelessly between your device and any web browser on your local network — upload, download, delete, rename, and more.

## Usage
1. Download [File Server.pak.zip](https://github.com/DendyLusus/minui-miyoo355-dufs-pak/raw/refs/heads/main/File%20Server.pak.zip) and extract it.
2. Copy `File Server.pak` to `/Tools/my355/` on your SD card (create the directories if needed). Verify `launch.sh` is at `/Tools/my355/File Server.pak/launch.sh`.
3. Insert the SD card and boot MinUI.
4. Make sure the device is [connected to Wi-Fi](https://github.com/DendyLusus/minui-miyoo355-wifi-pak).
5. Toggle File Server through the Tools menu.
6. Open a web browser and go to `http://<miyoo-ip>:65080` to access the file server.

To find your Miyoo Flip's IP address, check your router's connected devices list or use a network scanner app.
