ping_gateway_once () {
  port=${1:-"4000"}

  actual=$(curl -s http://localhost:${port}/graphql \
    -H 'content-type: application/json' \
    --data '{"query":"{__typename}"}')

  if [[ $actual == '{"data":{"__typename":"Query"}}' ]]; then
    return 1
  else
    return 0
  fi
}

wait_on_gateway () {
  port=${1:-"4000"}

  times=1

  while ping_gateway_once $port == 0; do
    sleep 1

    times=$((times+1))

    if [ $times -gt 20 ]; then
      echo "timeout waiting for gateway"
      exit 1
    fi
  done
}

clean_up_and_exit () {
  docker compose down
  exit $1
}
