import { GatewayConfig } from "@apollo/gateway";
import { ApolloGatewayContainerConfig } from "./types";

export type ContainerServiceConfig = NonNullable<
  ApolloGatewayContainerConfig["server"]
>;

export type ContainerGatewayConfig = NonNullable<
  ApolloGatewayContainerConfig["gateway"]
>;

export type ApolloGatewayContainerConfigReified = {
  server: ContainerServiceConfig;
  gateway: GatewayConfig;
};

export type ForwardHeadersConfig = ContainerGatewayConfig["forwardHeaders"];
export type UsageReportingConfig = ContainerServiceConfig["usageReporting"];
