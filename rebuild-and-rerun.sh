docker image rm -f doth-dashboard
docker build --tag doth-dashboard .
docker container rm -f doth-dashboard
docker run -d -p 8052:80 --name doth-dashboard doth-dashboard