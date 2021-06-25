#!/usr/bin/env sh

# -i 0 means use all processor cores
yarn pm2 start src/index.js -i ${PROCESS_COUNT:-0} --no-daemon --no-autorestart
