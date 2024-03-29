#!/bin/bash

if [ $# -ne 2 ]
  then
    printf "You need to supply command and API token\n\n"
    printf "Example:\n"
    printf "$0 \"/fm q dQw4w9WgXcQ\" \"api1234\"\n"
    printf " or \n"
    printf "npm run fm -- \"/fm q dQw4w9WgXcQ\" \"api1234\"\n"
    exit 1
fi

if [[ $1 != \/fm* ]]
  then
    printf "Invalid argument\n\n"
    printf "Argument needs to start with /fm \n\n"
    exit 1
fi

curl -s -S -X POST 'http://localhost:9000/api/commands/text' \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $2" \
  --data "{\"text\": \"$1\"}" \
  | jq -r .textResponse
