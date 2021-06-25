# Apollo Gateway Docker Container

## Configurable Functionality

- [ ] Gateway configuration
  - [-] `serviceList`
  - [-] `supergraphSdl`
  - [ ] `introspectionHeaders`
  - [-] `debug`
  - [-] Managed federation
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
  - [ ] health check
  - [ ] liveness check
  - [-] Usage reporting
  - [ ] APQ
  - [ ] Validation
    - [ ] Operation depth limiting
  - [ ] Cache control
  - [ ] Error formatting
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

## Unsupported Configuration

### Server

- `modules` - not relevant with federation
- `typeDefs` - not relevant with federation
- `parseOptions` - not relevant with federation
- `resolvers` - not relevant with federation
- `schema` - not relevant with federation
- `context` - preconfigured
- `mocks` - not relevant with federation
- `plugins` - preconfigured
- `persistedQueries` TODO
- `onHealthCheck`
- `experimental_approximateDocumentStoreMiB`
- `stopGracePeriodMillis`
- `stopOnTerminationSignals`
- `apollo` - use environment variables

### Gateway

- `logger`
- `fetcher`
- `serviceHealthCheck` - not a best practice
- `localServiceList` - for testing
- `introspectionHeaders` TODO
- `experimental_updateServiceDefinitions`
- `experimental_updateSupergraphSdl`
- `__exposeQueryPlanExperimental`

### Usage Reporting Plugin

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
