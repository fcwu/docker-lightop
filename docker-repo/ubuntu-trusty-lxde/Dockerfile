FROM ubuntu:14.04
MAINTAINER Doro Wu <fcwu.tw@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
ENV HOME /root

RUN apt-get update \
    && apt-get install -y --force-yes --no-install-recommends supervisor \
        sudo vim-tiny \
        net-tools \
        lxde x11vnc xvfb \
        gtk2-engines-murrine ttf-ubuntu-font-family \
        libreoffice firefox \
    && apt-get autoclean \
    && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*


ADD startup.sh /app/
ADD noVNC /app/noVNC/
ADD supervisord.conf /etc/supervisor/conf.d/
EXPOSE 6080
WORKDIR /app
ENTRYPOINT ["/app/startup.sh"]
