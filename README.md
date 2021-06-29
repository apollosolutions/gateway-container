# Apollo Gateway Docker Container

⚠️ WORK IN PROGRESS ⚠️ Not yet ready for production usage.

## Usage

```sh
APOLLO_KEY=<apollo api key> APOLLO_GRAPH_REF=my-graph@production docker run -d -p 4000:4000 ghcr.io/apollosolutions/gateway
```

## Configurable Functionality

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
  - [ ] Uplink fallback
- [ ] Server configuration
  - [x] `listen({ url, port })`
  - [x] CORS
  - [x] `introspection`
  - [x] `debug`
  - [x] health/read/live check
  - [x] Usage reporting
  - [x] Global Agent proxy configuration
  - [ ] OpenTelemetry
    - [x] Zipkin
    - [ ] Prometheus
  - [ ] APQ configuration
    - [x] Simple redis config
    - [ ] Cluster redis
    - [ ] Memcached
    - [ ] Process-shared cache (no additional infra)
  - [ ] Validation
    - [ ] Operation depth limiting
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

- [x] PROCESS_COUNT [default=number of cores]
- [x] PORT [default=4000]
- [x] HOST [default=localhost]
- [x] CONFIG_FILE [default=/etc/apollo/gateway.yaml]
- [x] SUPERGRAPH_SDL_PATH
- [x] GLOBAL_AGENT_HTTP_PROXY
- [x] GLOBAL_AGENT_HTTPS_PROXY
- [x] GLOBAL_AGENT_NO_PROXY

## Unsupported Configuration

### Server

Not relevant when using Apollo Federation:

- `modules`
- `typeDefs`
- `parseOptions`
- `resolvers`
- `schema`
- `mocks`
- `dataSources`
- `schemaDirectives` - removed in AS 3
- `subscriptions`
- `rootValue`
- `uploads`

Other configuration options

- `validationRules` - TODO
- `context` - preconfigured
- `plugins` - preconfigured
- `persistedQueries.cache` - TODO
- `cacheControl` - removed in AS 3
- `onHealthCheck`
- `formatError`
- `formatResponse`
- `experimental_approximateDocumentStoreMiB`
- `stopGracePeriodMillis`
- `stopOnTerminationSignals`
- `apollo` - use environment variables

### Gateway

- `logger`
- `fetcher`
- `serviceHealthCheck` - not a best practice
- `localServiceList` - for testing
- `introspectionHeaders` - TODO are these necessary? serviceList will be deprecated anyway
- `experimental_updateServiceDefinitions`
- `experimental_updateSupergraphSdl`
- `__exposeQueryPlanExperimental`

### Plugins

- Usage Reporting Plugin
  - `sendVariableValues: { transform: () => {} }`
  - `rewriteError`
  - `includeRequest`
  - `generateClientInfo`
  - `overrideReportedSchema`
  - `sendUnexecutableOperationDocuments`
  - `requestAgent`
  - `fetcher`
  - `logger`
  - `reportErrorFunction`
- Schema reporting plugin
  - Not supported with federation
- Inline trace plugin
  - `rewriteError`

### Additional Libraries

#### Redis Config

https://github.com/luin/ioredis/blob/HEAD/API.md#new_Redis

- `retryStrategy`
- `reconnectOnError`
- `readOnly`

### Zipkin Exporter Config

- `getExportRequestHeaders`
