FROM ubuntu:14.04
MAINTAINER Doro Wu <fcwu.tw@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

# setup our Ubuntu sources (ADD breaks caching)
RUN echo "deb http://ppa.launchpad.net/chris-lea/node.js/ubuntu trusty main \n\
">> /etc/apt/sources.list

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C7917B12
RUN apt-get update \
    && apt-get install -y --no-install-recommends sudo vim-tiny \
    && apt-get install -y --force-yes nodejs \
    && apt-get autoclean \
    && apt-get autoremove

ADD tty.js /tty.js/

ADD startup.sh /
EXPOSE 3000
WORKDIR /
ENTRYPOINT ["/startup.sh"]
