import {
  ApolloServerPluginUsageReporting,
  ApolloServerPluginUsageReportingDisabled,
  ApolloServerPluginInlineTraceDisabled,
} from "apollo-server-core";
import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";
import { reifyConfig as reifyRedisConfig } from "./redis.js";

/**
 * @param {import("./schema").ApolloGatewayContainerConfig} config
 * @returns {import("./types").ContainerGatewayConfig}
 */
export function convertServerConfig(config) {
  return {
    ...(config.server ?? {}),
    persistedQueries: getPersistedQueriesConfig(
      config.server?.persistedQueries
    ),
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
 * @param {import("./types").PersistedQueriesConfig} config
 */
function getPersistedQueriesConfig(config) {
  if (config === false) {
    return false;
  }

  if (typeof config === "object") {
    return {
      ttl: config.ttl,
      cache: config.redis
        ? new BaseRedisCache({
            client: new Redis(reifyRedisConfig(config.redis)),
          })
        : undefined,
    };
  }

  return undefined;
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
