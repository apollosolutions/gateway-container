#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

export APOLLO_SCHEMA_CONFIG_EMBEDDED=/etc/config/supergraph.graphql

docker compose \
  -f $(dirname $0)/docker-compose.yaml \
  -f $(dirname $0)/compose-subgraphs.yaml \
  up --build -d

wait_on_gateway

ACTUAL="$(curl -s http://localhost:4000/graphql -H 'content-type: application/json' --data '{"query":"{mission(id: \"1\") { name crew { name } } }"}')"

EXPECTED='{"data":{"mission":{"name":"Mission 1","crew":[{"name":"Astronaut 1"},{"name":"Astronaut 2"},{"name":"Astronaut 3"}]}}}'

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi
