FROM node:14-alpine
WORKDIR /web
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY index.js otel.js ./
CMD node index.js
