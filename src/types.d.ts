import { GatewayConfig } from "@apollo/gateway";
import { ApolloGatewayContainerConfiguration, OpenTelemetry } from "./schema";
import { ApolloServerExpressConfig, CorsOptions } from "apollo-server-express";

export type ContainerGatewayConfig = ApolloServerExpressConfig & {
  port?: string;
  host?: string;
  cors?: CorsOptions | boolean;
};

export type ApolloGatewayContainerConfigReified = {
  server: ContainerGatewayConfig;
  gateway: GatewayConfig;
  openTelemetry: OpenTelemetry;
};
