FROM node:14-alpine

WORKDIR /web

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY src src/

USER node
CMD src/docker_entrypoint.sh
