Docker Lightop
==================

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
