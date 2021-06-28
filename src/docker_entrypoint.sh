#!/usr/bin/env sh

# use the precomposed supergraph from the uplink instead of the old runtime composition
export APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT=${APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT:-https://uplink.api.apollographql.com/}

yarn pm2 start src/index.js -i ${PROCESS_COUNT:-max} --no-daemon --no-autorestart
