import { GatewayConfig } from "@apollo/gateway";
import { ApolloGatewayContainerConfig } from "./schema";
import { ApolloServerExpressConfig, CorsOptions } from "apollo-server-express";

export type ContainerGatewayConfig = ApolloServerExpressConfig & {
  port?: string;
  host?: string;
  cors?: CorsOptions | boolean;
};

export type ApolloGatewayContainerConfigReified = {
  server: ContainerGatewayConfig;
  gateway: GatewayConfig;
  openTelemetry: ApolloGatewayContainerConfig["openTelemetry"];
};

type ApolloGatewayServerConfig = NonNullable<
  ApolloGatewayContainerConfig["server"]
>;

export type ForwardHeadersConfig = ContainerGatewayConfig["forwardHeaders"];
export type UsageReportingConfig = ContainerServiceConfig["usageReporting"];
export type InlineTracingConfig = ContainerServiceConfig["inlineTracing"];
export type PersistedQueriesConfig =
  ApolloGatewayServerConfig["persistedQueries"];
