---
title: Unsupported Configuration
---

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
