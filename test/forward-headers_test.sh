#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

export APOLLO_GATEWAY_CONFIG_FILE=/etc/config/forward-headers.yaml

docker-compose \
  -f $(dirname $0)/docker-compose.yaml \
  -f $(dirname $0)/compose-subgraphs.yaml \
  up --build -d

wait_on_gateway

ACTUAL="$(curl -s http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -H 'Authorization: Bearer abcd1234' \
  -H 'x-api-key: supersecret' \
  -H 'x-request-id: auto-forwarded' \
  -H 'x-astronauts: 1' \
  -H 'x-not-astronauts: 2' \
  --data @- << EOF
{
  "query": "{
    a1: echoHeaderA(name: \"authorization\")
    a2: echoHeaderA(name: \"forwarded-api-key\")
    a3: echoHeaderA(name: \"x-request-id\")
    a4: echoHeaderA(name: \"x-astronauts\")
    a5: echoHeaderA(name: \"x-not-astronauts\")
    a6: echoHeaderA(name: \"x-hardcoded\")
    a7: echoHeaderA(name: \"x-from-env\")

    m1: echoHeaderM(name: \"authorization\")
    m2: echoHeaderM(name: \"forwarded-api-key\")
    m3: echoHeaderM(name: \"x-request-id\")
    m4: echoHeaderM(name: \"x-astronauts\")
    m5: echoHeaderM(name: \"x-not-astronauts\")
    m6: echoHeaderM(name: \"x-hardcoded\")
    m7: echoHeaderM(name: \"x-from-env\")
  }"
}
EOF
)"

EXPECTED='{"data":{"a1":"Bearer abcd1234","a2":"supersecret","a3":"auto-forwarded","a4":"1","a5":null,"a6":"somevalue","a7":"/etc/config/forward-headers.yaml","m1":"Bearer abcd1234","m2":"supersecret","m3":"auto-forwarded","m4":null,"m5":"2","m6":"somevalue","m7":"/etc/config/forward-headers.yaml"}}'

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi
