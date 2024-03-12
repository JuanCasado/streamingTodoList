#!/bin/bash

PORT_NUMBER=$1; shift
if [[ -z "$PORT_NUMBER" ]]; then
    PORT_NUMBER=3000
fi

echo "Starting server at http://localhost:$PORT_NUMBER"

cd "$(dirname "$0")"
nohup python3 -m http.server "$PORT_NUMBER" "$@" 2> .server.log 1> .server.log &
cd - 2> /dev/null 1> /dev/null

