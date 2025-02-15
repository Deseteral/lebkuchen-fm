#! /bin/sh

CONTAINER_NAME="lebkuchen-fm-db-local"

if [ "$1" == "stop" ]; then
  docker stop $CONTAINER_NAME
else
  docker start $CONTAINER_NAME || docker run -p 27017:27017 --name=$CONTAINER_NAME -d mongo:latest
fi
