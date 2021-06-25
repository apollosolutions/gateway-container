import {
  ApolloServerPluginUsageReporting,
  ApolloServerPluginUsageReportingDisabled,
} from "apollo-server-core";

/**
 * @param {import("./schema").ApolloGatewayContainerConfig} config
 * @returns {import("apollo-server-express").ApolloServerExpressConfig & { cors?: import("apollo-server").CorsOptions | boolean }}
 */
export function convertServerConfig(config) {
  return {
    ...(config.server ?? {}),
    plugins: [getUsageReportingPlugin(config.server?.usageReporting)].filter(
      /** @type {(x: any) => x is any} */
      (x) => !!x
    ),
  };
}

/**
 * @param {import("./types").UsageReportingConfig} config
 */
function getUsageReportingPlugin(config) {
  if (config === false) {
    return ApolloServerPluginUsageReportingDisabled();
  }

  if (typeof config === "object") {
    return ApolloServerPluginUsageReporting(config);
  }

  return null;
}
