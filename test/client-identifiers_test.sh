#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

export APOLLO_GATEWAY_CONFIG_FILE=/etc/config/client-identifiers.yaml

docker-compose \
  -f $(dirname $0)/docker-compose.yaml \
  -f $(dirname $0)/compose-subgraphs.yaml \
  up --build -d

wait_on_gateway

ACTUAL="$(curl -s http://localhost:4000/graphql -H 'content-type: application/json' --data '{"query":"{mission(id: \"1\") { name crew { name } } }"}')"

EXPECTED='{"errors":[{"message":"Execution denied: client identification headers (my-client-name, apollographql-client-version) not provided","extensions":{"code":"CLIENT_IDENTIFIERS_MISSING"}}]}'

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Invalid query: Success!"
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi

ACTUAL2="$(curl -s http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -H 'my-client-name: hello' \
  -H 'apollographql-client-version: 1.0' \
  --data '{"query":"{mission(id: \"1\") { name crew { name } } }"}')"

EXPECTED2='{"data":{"mission":{"name":"Mission 1","crew":[{"name":"Astronaut 1"},{"name":"Astronaut 2"},{"name":"Astronaut 3"}]}}}'

if [[ "$ACTUAL2" = "$EXPECTED2" ]]; then
  echo "Valid query: Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED2"
  echo "Got      $ACTUAL2"
  clean_up_and_exit 1
fi
