#!/bin/bash

error () {
  echo >&2 "$@"
  exit 1
}

[ "$#" -ne 0 ] || error '
Usage:
local-command "/fm command"
'

curl -s -X POST 'http://localhost:9000/commands/text' \
  -H "Content-Type: application/json" \
  --data "{\"text\": \"$1\"}" \
  | jq -r .textResponse
