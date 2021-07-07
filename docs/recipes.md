---
title: Configuration Recipes
---

# Configuration Recipes

## Automatic Persisted Queries

Between the gateway and subgraphs:

```yaml
gateway:
  persistedQueries: true
```

With a Redis cache backend:

```yaml
server:
  persistedQueries:
    redis:
      host: redis
      port: 6379
```

## Client Identifiers

```yaml
server:
  clientIdentifiers:
    required: true
```

Choosing different headers:

```yaml
server:
  clientIdentifiers:
    clientNameHeader: my-client-header
    clientVersionHeader: my-version-header
```

## Config File

```sh
docker run -e APOLLO_GATEWAY_CONFIG_FILE=/some/other/file.yaml ...
```

## CORS

[Documentation](https://github.com/expressjs/cors#configuration-options)

```yaml
server:
  cors:
    origin: example.com
```

## Debugging

```yaml
server:
  debug: true
gateway:
  debug: true
```

## Depth Limiting

```yaml
server:
  depthLimit:
    maxDepth: 10
```

## Disable Inline Tracing

```yaml
server:
  inlineTracing: false
```

## Errors

### Remove Suggestions

On by default when `NODE_ENV === 'production'`.

```yaml
server:
  errors:
    removeSuggestions: true
```

### Remove Stacktraces

On by default when `NODE_ENV === 'production'`.

```yaml
server:
  errors:
    removeStacktrace: true
```

### Mask Errors by Message

Replaces matching errors with a generic "Internal server error".

```yaml
server:
  errors:
    mask:
      - message:
          matches: a substring
      - message:
          startsWith: a prefix
```

## Gateway Schema

### Managed Federation

```bash
docker run \
  -e APOLLO_KEY=<studio api key> \
  -e APOLLO_GRAPH_REF=mygraph@production \
  ...
```

Customizing the Uplink

```bash
docker run \
  -e APOLLO_KEY=<studio api key> \
  -e APOLLO_GRAPH_REF=mygraph@production \
  -e APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT=http://my-uplink-proxy \
  ...
```

### Supergraph SDL

```bash
docker run \
  -e APOLLO_SCHEMA_CONFIG_EMBEDDED=/etc/config/supergraph.graphql \
  ...
```

or

```yaml
gateway:
  supergraphSdlPath: /etc/config/supergraph.graphql
```

### Service List

(Not recommended; use [rover local composition](https://www.apollographql.com/docs/rover/supergraphs/#composing-a-supergraph-schema) and Supergraph SDL instead.)

```yaml
gateway:
  serviceList:
    - name: astronauts
      url: http://astronauts:4001/graphql
    - name: missions
      url: http://missions:4002/graphql
```

## Health Check

In Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: gateway
  name: gateway
spec:
  template:
    spec:
      containers:
        - image: ghcr.io/apollosolutions/gateway
          ports:
            - name: http
              containerPort: 4000
          livenessProbe:
            httpGet:
              path: /.well-known/apollo/server-health
              port: http
          readinessProbe:
            httpGet:
              path: /.well-known/apollo/server-health
              port: http
```

## HTTP Proxy

Using [Global Agent](https://www.apollographql.com/docs/apollo-server/proxy-configuration/).

```sh
docker run \
  -e GLOBAL_AGENT_HTTP_PROXY=http://proxy:3128/ \
  -e GLOBAL_AGENT_HTTPS_PROXY=https://proxy:3128/ \
  -e GLOBAL_AGENT_NO_PROXY=localhost \
  ...
```

## HTTP Server

```bash
docker run -e PORT=80 -e HOST=0.0.0.0 ...
```

or

```yaml
server:
  port: 80
  host: 0.0.0.0
```

## Introspection

Disabled by default when `NODE_ENV` equals `"production"`.

```yaml
server:
  introspection: false
```

## Landing Page

```yaml
server:
  landingPage: false
```

## Open Telemetry

```yaml
openTelemetry:
  serviceName: my-gateway
  zipkin:
    url: http://zipkin:9411/api/v2/spans
```

## Playground

```yaml
server:
  playground: true
```

```yaml
server:
  playground:
    editor.theme: dark
```

## Request Header Propagation

All headers with exceptions:

```yaml
gateway:
  forwardHeaders:
    - all: true
      except:
        - x-sensitive-header
```

Specific headers:

```yaml
gateway:
  forwardHeaders:
    - name: x-api-key
```

With different values:

```yaml
gateway:
  forwardHeaders:
    - name: x-api-key
      value: some hardcoded value
    - name: x-api-key-from-environment
      value:
        env: API_KEY
    - name: renamed-key
      value:
        header: original-header
```

For specific subgraphs:

```yaml
gateway:
  forwardHeaders:
    - name: x-api-key
      subgraphs:
        only:
          - subgraph-a
    - name: x-another
      subgraphs:
        except:
          - subgraph-b
```

## Require Operation Names

```yaml
server:
  requireOperationNames: true
```

## TLS Certificates

[Built into Apollo Server](https://www.apollographql.com/docs/apollo-server/proxy-configuration/#specifying-a-custom-ssltls-certificate).

## Usage Reporting

```yaml
server:
  usageReporting: false
```

```yaml
server:
  usageReporting:
    sendVariableValues:
      all: true
    sendHeaders:
      all: true
    sendUnexecutableOperationDocuments: true
    sendReportsImmediately: true
    reportIntervalMs: 1000
    maxUncompressedReportSize: 10
    maxAttempts: 3
    minimumRetryDelayMs: 100
```
