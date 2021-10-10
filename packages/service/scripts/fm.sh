#!/bin/bash

params="text=/fm"

for param in "$@"
do
    params="$params $param"
done

curl -X POST -sSd "$params" http://localhost:9000/commands/text | jq
