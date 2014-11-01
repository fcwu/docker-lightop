#!/bin/bash

USER=${USER:-ubuntu}
XWIDTH=${WIDTH:-1024}
XHEIGHT=${HEIGHT:-768}
XHEIGHT=$((XHEIGHT - 36))

useradd --create-home --shell /bin/bash --user-group --groups adm,sudo $USER
echo "$USER:$USER" | chpasswd
chown $USER /home/$USER
sed -i -e "s/USER/$USER/" -e "s/XWIDTH/$XWIDTH/" -e "s/XHEIGHT/$XHEIGHT/" /etc/supervisor/conf.d/supervisord.conf
cat >> /etc/sudoers <<EOF
${USER} ALL=NOPASSWD: ALL
EOF


/usr/bin/supervisord -n
