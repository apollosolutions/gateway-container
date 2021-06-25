import { ApolloServer } from "apollo-server";
import { ApolloGateway } from "@apollo/gateway";
import { fetchConfig } from "./config.js";

const config = await fetchConfig();

const gateway = new ApolloGateway(config.gateway);

const server = new ApolloServer({
  ...config.server,
  gateway,
  context(ctx) {
    return ctx;
  },
});

const { url } = await server.listen({
  port: config?.server?.port ?? process.env.PORT ?? 4000,
  url: config?.server?.url ?? process.env.URL,
});

console.log(`Gateway running at ${url}`);
