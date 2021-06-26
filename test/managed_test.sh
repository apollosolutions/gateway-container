#!/usr/bin/env bash

source $(dirname $0)/util/ping.sh

export APOLLO_KEY=$TEST_APOLLO_KEY
docker compose --file $(dirname $0)/docker-compose.yaml --env-file $(dirname $0)/.env.managed up --build -d

wait_on_gateway

ACTUAL="$(curl -s http://localhost:4000/graphql -H 'content-type: application/json' --data '{"query":"{mission(id: \"1\") { name crew { name } } }"}')"

EXPECTED='{"data":{"mission":{"name":"Mission 1","crew":[{"name":"Astronaut 1"},{"name":"Astronaut 2"},{"name":"Astronaut 3"}]}}}'

exit_code=0
if [[ "$ACTUAL" = "$EXPECTED" ]]; then
  echo "Success!"
else
  echo "Expected $EXPECTED"
  echo "Got      $ACTUAL"
  exit_code=1
fi

docker compose down

exit $exit_code
