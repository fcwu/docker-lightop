ubuntu-trusty-ttyjs
=========================

From Docker Index?

Build yourself
```
docker build --rm -t dorowu/ubuntu-trusty-ttyjs:v1 .
docker run -it --rm -e USER=admin -e PASS=admin -p 3000:3000 dorowu/ubuntu-trusty-ttyjs:v1
```

Browse http://127.0.0.1:3000/vnc.html
