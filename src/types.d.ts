import { GatewayConfig } from "@apollo/gateway";
import { ApolloGatewayContainerConfig } from "./types";

export type ApolloGatewayContainerConfigReified = {
  server: NonNullable<ApolloGatewayContainerConfig["server"]>;
  gateway: GatewayConfig;
};

export type ContainerGatewayConfig = NonNullable<
  ApolloGatewayContainerConfig["gateway"]
>;

export type ForwardHeadersConfig = ContainerGatewayConfig["forwardHeaders"];
