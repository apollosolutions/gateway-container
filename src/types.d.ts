import { GatewayConfig } from "@apollo/gateway";
import { ApolloGatewayContainerConfig } from "./types";
import { Config } from "apollo-server-core";
import { CorsOptions } from "apollo-server-express";

export type ContainerGatewayConfig = Config & {
  port?: string;
  host?: string;
  cors?: CorsOptions | boolean; // TODO should be CorsOptions
};

export type ApolloGatewayContainerConfigReified = {
  server: ContainerGatewayConfig;
  gateway: GatewayConfig;
};

export type ContainerServerConfig = NonNullable<
  ApolloGatewayContainerConfig["server"]
>;

export type ForwardHeadersConfig = ContainerGatewayConfig["forwardHeaders"];
export type UsageReportingConfig = ContainerServiceConfig["usageReporting"];
export type InlineTracingConfig = ContainerServiceConfig["inlineTracing"];
