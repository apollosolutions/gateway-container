#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

docker compose --file $(dirname $0)/docker-compose.yaml --env-file $(dirname $0)/.env.forward-headers up --build -d

wait_on_gateway

ACTUAL="$(set -x; curl -s http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  -H 'Authorization: Bearer abcd1234' \
  -H 'x-api-key: supersecret' \
  --data @- << EOF
{
  "query": "{
    a: echoHeaderA(name: \"authorization\")
    b: echoHeaderA(name: \"forwarded-api-key\")
    c: echoHeaderM(name: \"authorization\")
    d: echoHeaderM(name: \"forwarded-api-key\")
  }"
}
EOF
)"

EXPECTED='{"data":{"a":"Bearer abcd1234","b":"supersecret","c":"Bearer abcd1234","d":"supersecret"}}'

exit_code=0
if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  exit_code=1
fi

docker compose down --file $(dirname $0)/docker-compose.yaml

exit $exit_code
