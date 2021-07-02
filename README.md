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
  -e APOLLO_SCHEMA_CONFIG_EMBEDDED=/etc/supergraph.graphql \
  -v $PWD/supergraph.graphql:/etc/supergraph.graphql \
  -p 4000:4000 \
  ghcr.io/apollosolutions/gateway
```

### Configuration File

```sh
docker run -d \
  -v $PWD/config.yaml:/etc/config/gateway.yaml \
  -p 4000:4000 \
  ghcr.io/apollosolutions/gateway
```

## Configurable Functionality

- [Configuration in JSON Schema](https://github.com/apollosolutions/gateway-container/blob/main/src/config.schema.json)
- [Configuration Recipes](https://github.com/apollosolutions/gateway-container/blob/main/docs/recipes.md)
- [Best Practices Enabled by Default](https://github.com/apollosolutions/gateway-container/blob/main/docs/best-practices.md)
- [Unsupported Configuration](https://github.com/apollosolutions/gateway-container/blob/main/docs/unsupported-configuration.md)
