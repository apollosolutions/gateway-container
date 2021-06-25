# Apollo Gateway Docker Container

## Configurable Functionality

- [ ] Gateway configuration
  - [-] `serviceList`
  - [-] `supergraphSdl`
  - [ ] `introspectionHeaders`
  - [-] `debug`
  - [ ] ~~`serviceHealthCheck`~~
  - [-] Managed federation
  - [ ] Request header propagation
    - [-] Simple
    - [ ] Per-subgraph
    - [ ] Aggregation?
  - [ ] Uplink fallback
  - [ ] fetcher configuration
    - [ ] ...
- [ ] Server configuration
  - [-] `listen({ url, port })`
  - [-] CORS
  - [-] `introspection`
  - [-] `debug`
  - [ ] health check
  - [ ] liveness check
  - [ ] Usage reporting
  - [ ] APQ
  - [ ] Validation
    - [ ] Operation depth limiting
  - [ ] Cache control
  - [ ] Error formatting
  - [ ] `stopGracePeriodMillis`
  - [ ] Landing page
  - [ ] Global Agent proxy configuration

## Environment Variables

### Built-in

- [-] APOLLO_KEY
- [-] APOLLO_GRAPH_REF
- [-] APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT [default=https://uplink.api.apollographql.com/]

### Container-specific

- [-] PROCESS_COUNT [default=number of cores]
- [-] PORT [default=4000]
- [-] URL [default=localhost]
- [-] CONFIG_FILE [default=/etc/apollo/gateway.yaml]
- [-] SUPERGRAPH_SDL_PATH
