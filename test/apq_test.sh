#!/usr/bin/env bash

CWD="$(dirname $0)/"
source ${CWD}util/ping.sh

export APOLLO_GATEWAY_CONFIG_FILE=/etc/apollo/apq.yaml

docker compose \
  -f ${CWD}docker-compose.yaml \
  -f ${CWD}compose-subgraphs.yaml \
  -f ${CWD}compose-redis.yaml \
  up --build -d

wait_on_gateway

error_code="$(curl -s -g 'http://localhost:4000/graphql?extensions={"persistedQuery":{"version":1,"sha256Hash":"e84522799b8f138452f8022c4edeb0b9db9cf77782d3e934d34f2832c9f77b71"}}' | jq '.errors[0].extensions.code')"

if [[ "$error_code" != "\"PERSISTED_QUERY_NOT_FOUND\"" ]]; then
  echo "Expected error code PERSISTED_QUERY_NOT_FOUND"
  echo $error_code
  clean_up_and_exit 1
fi

ACTUAL="$(curl -s -g 'http://localhost:4000/graphql?query={mission(id:"1"){name,crew,{name}}}&extensions={"persistedQuery":{"version":1,"sha256Hash":"e84522799b8f138452f8022c4edeb0b9db9cf77782d3e934d34f2832c9f77b71"}}')"
EXPECTED='{"data":{"mission":{"name":"Mission 1","crew":[{"name":"Astronaut 1"},{"name":"Astronaut 2"},{"name":"Astronaut 3"}]}}}'

if [[ "$ACTUAL" != "$EXPECTED" ]]; then
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi

ACTUAL="$(curl -s -g 'http://localhost:4000/graphql?extensions={"persistedQuery":{"version":1,"sha256Hash":"e84522799b8f138452f8022c4edeb0b9db9cf77782d3e934d34f2832c9f77b71"}}')"

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi
