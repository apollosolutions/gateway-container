import { fetchConfig } from "./config.js";
import { setupOpentelemetry } from "./open-telemetry.js";

const config = await fetchConfig();

if (config.openTelemetry) {
  setupOpentelemetry(config.openTelemetry);
}

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";
import { bootstrap as bootstrapGlobalAgent } from "global-agent";

bootstrapGlobalAgent();

const gateway = new ApolloGateway(config.gateway);

const server = new ApolloServer({
  ...config.server,
  // @ts-ignore
  gateway,
  context(ctx) {
    return ctx;
  },
});

const app = express();

app.get("/readyz", (_, res) => res.send("ok"));
app.get("/livez", (_, res) => res.send("ok"));
app.get("/healthz", (_, res) => res.send("ok"));

await server.start();
server.applyMiddleware({ app });

const port = parseInt(config.server.port ?? process.env.PORT ?? "4000", 10);
const host = config.server.host ?? process.env.HOST;

await new Promise((resolve) =>
  app.listen({ port, host }, () => resolve(undefined))
);

console.log(`Gateway running at ${host ?? "localhost"}:${port}`);
