docker container rm -f doth-dashboard
docker run -d -p 8052:80 --restart always --name doth-dashboard doth-dashboard
