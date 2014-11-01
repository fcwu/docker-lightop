FROM ubuntu:14.04
MAINTAINER Doro Wu <fcwu.tw@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN echo "deb http://get.docker.io/ubuntu docker main \n\
deb http://ppa.launchpad.net/nginx/development/ubuntu trusty main \n\
">> /etc/apt/sources.list

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9 C300EE8C
RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx python-pip python-dev lxc-docker build-essential \
    && apt-get autoclean \
    && apt-get autoremove

ADD startup.sh /app/
ADD web /app/web

WORKDIR /app
RUN pip install -r /app/web/requirements.txt

EXPOSE 6050
EXPOSE 6051
ENTRYPOINT ["/app/startup.sh"]
