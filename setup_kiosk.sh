# Script to install and configure a base Debian system to auto-launch
# Firefox in kiosk mode at login

# Inspiration taken from https://die-antwort.eu/techblog/2017-12-setup-raspberry-pi-for-kiosk-mode/

sudo apt update
sudo apt install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
sudo apt-get install --no-install-recommends firefox-esr
sudo apt install nginx

sudo adduser --disabled-password --gecos "" orario

echo """#
xset s off
xset s noblank
xset -dpms

# Allow quitting the X server with CTRL-ATL-Backspace
setxkbmap -option terminate:ctrl_alt_bksp

DISPLAY=:0 xrandr --output HDMI-1 --rotate left

firefox -kiosk -private-window http://localhost""" | sudo tee /etc/xdg/openbox/autostart

sudo sed -i 's/#NAutoVTs=6/NAutoVTs=1/g' /etc/systemd/logind.conf

sudo mkdir -p /etc/systemd/system/getty@tty1.service.d

echo """[Service]
ExecStart=-/sbin/agetty --autologin orario --noclear %I 38400 linux""" | sudo tee /etc/systemd/system/getty@tty1.service.d/override.conf

echo "[[ -z \$DISPLAY && \$XDG_VTNR -eq 1 ]] && startx -- -nocursor" | sudo tee /home/orario/.bash_profile

sudo systemctl daemon-reload
sudo systemctl enable getty@tty1.service