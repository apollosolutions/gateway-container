#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

export APOLLO_GATEWAY_CONFIG_FILE=/etc/apollo/forward-headers.yaml

docker compose \
  -f $(dirname $0)/docker-compose.yaml \
  -f $(dirname $0)/compose-subgraphs.yaml \
  up --build -d

wait_on_gateway

ACTUAL="$(curl -s http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -H 'Authorization: Bearer abcd1234' \
  -H 'x-api-key: supersecret' \
  -H 'x-request-id: auto-forwarded' \
  --data @- << EOF
{
  "query": "{
    a: echoHeaderA(name: \"authorization\")
    b: echoHeaderA(name: \"forwarded-api-key\")
    c: echoHeaderA(name: \"x-request-id\")
    d: echoHeaderM(name: \"authorization\")
    e: echoHeaderM(name: \"forwarded-api-key\")
    f: echoHeaderM(name: \"x-request-id\")
  }"
}
EOF
)"

EXPECTED='{"data":{"a":"Bearer abcd1234","b":"supersecret","c":"auto-forwarded","d":"Bearer abcd1234","e":"supersecret","f":"auto-forwarded"}}'

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi
