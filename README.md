Docker Lightop
==================

docker-lightop is a login manager for various docker containers(session). Currently, this project provides sessions including,

* [dorowu/lightop-ubuntu-trusty-ttyjs](https://registry.hub.docker.com/u/dorowu/lightop-ubuntu-trusty-ttyjs/): a text-mode login interface for Ubuntu 14.04
* [dorowu/lightop-ubuntu-trusty-lxde](https://registry.hub.docker.com/u/dorowu/lightop-ubuntu-trusty-lxde/): a LXDE login interface for Ubuntu 14.04

When user login to the session, the container, if not exist, will be created immediatey. The user home folder(~) in every containers of the same user will be mounted to the same volume. The public folder located at /mnt/public, which shares to the all users of this service.

Build and Run
---------------

Build yourself

```
docker build --rm -t dorowu/lightop . 
docker build --rm -t dorowu/lightop-ubuntu-trusty-ttyjs docker-repo/ubuntu-trusty-ttyjs/
docker build --rm -t dorowu/lightop-ubuntu-trusty-lxde docker-repo/ubuntu-trusty-lxde
```

Run

```
docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock -p 6050:6050 -p 6051:6051 dorowu/lightop
```

Browse

```
http://$IP:6050/
``` 
that default account is admin/admin

Screenshot
-----------------------

<img src="https://raw.github.com/fcwu/docker-lightop/master/screenshots/s-login.png" width=400/>

<img src="https://raw.github.com/fcwu/docker-lightop/master/screenshots/s-ttyjs.png" width=400/>

<img src="https://raw.github.com/fcwu/docker-lightop/master/screenshots/s-lxde.png" width=400/>

<img src="https://raw.github.com/fcwu/docker-lightop/master/screenshots/s-admin-user.png" width=400/>

<img src="https://raw.github.com/fcwu/docker-lightop/master/screenshots/s-admin-ct.png" width=400/>

API
-----------------------

```
IP=127.0.0.1
curl -sq -XPOST -c cookies.txt -d 'username=admin&password=admin' http://$IP:6050/login
curl -sq -b cookies.txt  http://$IP:6050/user/
curl -sq -b cookies.txt -XPOST -d "username=walker&password=walker" http://$IP:6050/user/
curl -sq -b cookies.txt  http://$IP:6050/user/
curl -sq -b cookies.txt -XDELETE http://$IP:6050/user/2
curl -sq -b cookies.txt http://$IP:6050/session
curl -sq -b cookies.txt http://$IP:6050/container/
curl -sq -b cookies.txt -XDELETE http://$IP:6050/container/6a72a2e5c372
```
