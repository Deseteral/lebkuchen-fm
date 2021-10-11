#!/bin/bash

params="text=/fm"

if [ $# -ne 1 ]
  then
    printf "You need to supply a single argument\n\n"
    printf "Example:\n"
    printf "$0 \"/fm q dQw4w9WgXcQ\"\n"
    printf " or \n"
    printf "npm run fm -- \"/fm q dQw4w9WgXcQ\"\n"
    exit 1
fi

if [[ $1 != \/fm* ]]
  then
    printf "Invalid argument\n\n"
    printf "Argument needs to start with /fm \n\n"
    exit 1
fi

curl -s -S -X POST 'http://localhost:9000/commands/text' \
  -H "Content-Type: application/json" \
  --data "{\"text\": \"$1\"}" \
  | jq
