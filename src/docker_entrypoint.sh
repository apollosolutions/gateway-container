#!/usr/bin/env sh

# use the precomposed supergraph from the uplink instead of the old runtime composition
# TODO: remove when the uplink is the default
export APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT=${APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT:-https://uplink.api.apollographql.com/}

yarn pm2-runtime start src/index.js -i ${APOLLO_GATEWAY_PROCESS_COUNT:-max} --no-autorestart
