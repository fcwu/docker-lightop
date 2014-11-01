#!/bin/bash

USER=${USER:-admin}
PASS=${PASS:-admin}
echo "User: ubuntu Pass: $PASS"
useradd --create-home --shell /bin/bash --user-group --groups adm,sudo ${USER}
echo "${USER}:${PASS}" | chpasswd
cat >> /etc/sudoers <<EOF
${USER} ALL=NOPASSWD: ALL
EOF

cd /tty.js && sudo -u ${USER} env HOME=/home/$USER node ./tty-me.js
