# Apollo Gateway Docker Container

## Configurable Functionality

- [ ] Gateway configuration
  - [-] `serviceList`
  - [-] `supergraphSdl`
  - [-] `debug`
  - [-] Managed federation
  - [-] Persisted queries to subgraphs
  - [ ] Request header propagation
    - [-] Simple
    - [ ] Per-subgraph
    - [ ] Aggregation?
  - [ ] Uplink fallback
- [ ] Server configuration
  - [-] `listen({ url, port })`
  - [-] CORS
  - [-] `introspection`
  - [-] `debug`
  - [-] health/read/live check
  - [-] Usage reporting
  - [-] Global Agent proxy configuration
  - [-] OpenTelemetry
  - [ ] APQ configuration
  - [ ] Validation
    - [ ] Operation depth limiting
  - [ ] Cache control
  - [ ] Error formatting
  - [ ] Landing page

## Environment Variables

### Built-in

- [-] APOLLO_KEY
- [-] APOLLO_GRAPH_REF
- [-] APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT [default=https://uplink.api.apollographql.com/]
- [-] NODE_EXTRA_CA_CERTS

### Container-specific

- [-] PROCESS_COUNT [default=number of cores]
- [-] PORT [default=4000]
- [-] HOST [default=localhost]
- [-] CONFIG_FILE [default=/etc/apollo/gateway.yaml]
- [-] SUPERGRAPH_SDL_PATH
- [-] GLOBAL_AGENT_HTTP_PROXY
- [-] GLOBAL_AGENT_HTTPS_PROXY
- [-] GLOBAL_AGENT_NO_PROXY

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
- `schemaDirectives`
- `subscriptions`
- `rootValue`
- `uploads`

Other configuration options

- `validationRules` - TODO
- `context` - preconfigured
- `plugins` - preconfigured
- `persistedQueries.cache` - TODO
- `cacheControl` - TODO
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
