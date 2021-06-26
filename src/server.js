import {
  ApolloServerPluginUsageReporting,
  ApolloServerPluginUsageReportingDisabled,
  ApolloServerPluginInlineTraceDisabled,
} from "apollo-server-core";

/**
 * @param {import("./schema").ApolloGatewayContainerConfig} config
 * @returns {import("./types").ContainerServerConfig}
 */
export function convertServerConfig(config) {
  return {
    ...(config.server ?? {}),
    plugins: [
      getUsageReportingPlugin(config.server?.usageReporting),
      getInlineTracingPlugin(config.server?.inlineTracing),
    ].filter(
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

/**
 * @param {import("./types").InlineTracingConfig} config
 */
function getInlineTracingPlugin(config) {
  if (config === false) {
    return ApolloServerPluginInlineTraceDisabled();
  }

  return null;
}
