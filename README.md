# Apollo Gateway Docker Container

⚠️ WORK IN PROGRESS ⚠️ Not yet ready for production usage.

## Usage

### Managed Federation

```sh
docker run -d \
  -e APOLLO_KEY=<apollo api key> \
  -e APOLLO_GRAPH_REF=my-graph@production \
  -p 4000:4000 \
  ghcr.io/apollosolutions/gateway
```

### Supergraph SDL

```sh
docker run -d \
  -e SUPERGRAPH_SDL_PATH=/etc/supergraph.graphql \
  -v $PWD/supergraph.graphql:/etc/supergraph.graphql \
  -p 4000:4000 \
  ghcr.io/apollosolutions/gateway
```

### Configuration File

```sh
docker run -d \
  -v $PWD/config.yaml:/etc/apollo/gateway.yaml \
  -p 4000:4000 \
  ghcr.io/apollosolutions/gateway
```

## Configurable Functionality

[Configuration in JSON Schema](https://github.com/apollosolutions/gateway-container/blob/main/src/config.schema.json)

- [ ] Gateway configuration
  - [x] `serviceList`
  - [x] `supergraphSdl`
  - [x] `debug`
  - [x] Managed federation
  - [x] Persisted queries to subgraphs
  - [ ] Request header propagation
    - [x] Simple
    - [ ] Per-subgraph
    - [ ] Aggregation?
  - [ ] Response header propagation
  - [ ] Uplink fallback
- [ ] Server configuration
  - [x] `listen({ url, port })`
  - [x] CORS
  - [x] `introspection`
  - [x] `debug`
  - [x] health/read/live check
  - [x] Usage reporting
  - [x] Global Agent proxy configuration
  - [x] OpenTelemetry
    - [x] Zipkin
  - [ ] APQ configuration
    - [x] Simple redis config
    - [ ] Cluster redis
    - [ ] Memcached
  - [ ] Validation
    - [x] Operation depth limiting
    - [ ] Required client identifiers
  - [ ] Cache control
  - [ ] Error formatting
    - [x] Remove suggested fields
  - [ ] Landing page

## Environment Variables

### Built-in

- [x] APOLLO_KEY
- [x] APOLLO_GRAPH_REF
- [x] APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT [default=https://uplink.api.apollographql.com/]
- [x] NODE_EXTRA_CA_CERTS

### Container-specific

- [x] APOLLO_GATEWAY_PROCESS_COUNT [default=number of cores]
- [x] PORT [default=4000]
- [x] HOST [default=localhost]
- [x] APOLLO_GATEWAY_CONFIG_FILE [default=/etc/apollo/gateway.yaml]
- [x] SUPERGRAPH_SDL_PATH
- [x] GLOBAL_AGENT_HTTP_PROXY
- [x] GLOBAL_AGENT_HTTPS_PROXY
- [x] GLOBAL_AGENT_NO_PROXY
