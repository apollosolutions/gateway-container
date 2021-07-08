#!/usr/bin/env bash

CWD="$(dirname $0)/"
source ${CWD}util/ping.sh

export APOLLO_GATEWAY_CONFIG_FILE=/etc/config/open-telemetry.yaml

docker-compose \
  -f ${CWD}docker-compose.yaml \
  -f ${CWD}compose-subgraphs.yaml \
  -f ${CWD}compose-zipkin.yaml \
  up --build -d

wait_on_gateway

curl -s http://localhost:4000/graphql -H 'content-type: application/json' --data '{"query":"{mission(id: \"1\") { name crew { name } } }"}'

sleep 1

ACTUAL="$(curl -s 'http://localhost:9411/api/v2/spans?serviceName=gateway' -H 'content-type: application/json')"

EXPECTED='["gateway.execute","gateway.fetch","gateway.plan","gateway.postprocessing","gateway.request","gateway.validate"]'

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi
