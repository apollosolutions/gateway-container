#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

export APOLLO_GATEWAY_CONFIG_FILE=/etc/config/depth-limit.yaml

docker compose \
  -f $(dirname $0)/docker-compose.yaml \
  -f $(dirname $0)/compose-subgraphs.yaml \
  up --build -d

wait_on_gateway

ACTUAL="$(curl -s http://localhost:4000/graphql -H 'content-type: application/json' --data '{"query":"{mission(id: \"1\") { name crew { name } } }"}')"

EXPECTED='{"data":{"mission":{"name":"Mission 1","crew":[{"name":"Astronaut 1"},{"name":"Astronaut 2"},{"name":"Astronaut 3"}]}}}'

if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Valid query: Success!"
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  clean_up_and_exit 1
fi

ACTUAL2="$(curl -s http://localhost:4000/graphql \
  -H 'content-type: application/json' \
  --data @- << EOF
{
  "query": "query Test {
    mission(id: \"1\") {
      crew {
        missions {
          crew {
            id
          }
        }
      }
    }
  }"
}
EOF
)"

EXPECTED2='{"errors":[{"message":"'"'"'Test'"'"' exceeds maximum operation depth of 3","locations":[{"line":1,"column":93}],"extensions":{"code":"GRAPHQL_VALIDATION_FAILED"}}]}'

if [[ "$ACTUAL2" = "$EXPECTED2" ]]; then
  echo "Invalid query: Success!"
  clean_up_and_exit 0
else
  echo "Expected $EXPECTED2"
  echo "Got      $ACTUAL2"
  clean_up_and_exit 1
fi
