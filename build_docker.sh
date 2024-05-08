service=$1
ver=$2

docker build -t 686234521545.dkr.ecr.ap-southeast-1.amazonaws.com/$service:$ver -f microservices/$service/Dockerfile .