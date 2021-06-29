import { fetchConfig } from "./config.js";
import { setupOpentelemetry } from "./open-telemetry.js";

const config = await fetchConfig();

if (config.openTelemetry) {
  setupOpentelemetry(config.openTelemetry);
}

import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import { bootstrap as bootstrapGlobalAgent } from "global-agent";

bootstrapGlobalAgent();

const gateway = new ApolloGateway(config.gateway);

const server = new ApolloServer({
  ...config.server,
  gateway,
  context(ctx) {
    return ctx;
  },
});

const port = parseInt(config.server.port ?? process.env.PORT ?? "4000", 10);
const host = config.server.host ?? process.env.HOST;

const { url } = await server.listen({ port, host });
console.log(`Gateway running at ${url}`);
