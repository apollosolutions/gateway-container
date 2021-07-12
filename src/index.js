(async () => {
  const { fetchConfig } = require("./config");
  const { setupOpentelemetry } = require("./open-telemetry");

  const config = await fetchConfig();

  if (config.openTelemetry) {
    setupOpentelemetry(config.openTelemetry, config.server);
  }

  const { ApolloServer } = require("apollo-server");
  const { ApolloGateway } = require("@apollo/gateway");
  const { bootstrap: bootstrapGlobalAgent } = require("global-agent");
  const { convertGatewayConfig } = require("./gateway");
  const { convertServerConfig } = require("./server");

  bootstrapGlobalAgent();

  const [gatewayConfig, serverConfig] = await Promise.all([
    convertGatewayConfig(config),
    convertServerConfig(config),
  ]);

  const gateway = new ApolloGateway(gatewayConfig);

  const server = new ApolloServer({
    ...serverConfig,
    gateway,
    context(ctx) {
      return ctx;
    },
  });

  const port = parseInt(serverConfig.port ?? process.env.PORT ?? "4000", 10);
  const host = serverConfig.host ?? process.env.HOST;

  const { url } = await server.listen({ port, host });
  console.log(`Gateway running at ${url}`);
})();
