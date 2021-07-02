import {
  ApolloServerPluginUsageReporting,
  ApolloServerPluginUsageReportingDisabled,
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { BaseRedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis";
import { reifyConfig as reifyRedisConfig } from "./redis.js";
import { validationRules } from "./validation.js";
import { ApolloError } from "apollo-server";

/**
 * @param {import("./schema").ApolloGatewayContainerConfiguration} config
 * @returns {import("./types").ContainerGatewayConfig}
 */
export function convertServerConfig(config) {
  return {
    ...(config.server ?? {}),

    persistedQueries: getPersistedQueriesConfig(
      config.server?.persistedQueries
    ),

    formatError(error) {
      // remove stacktrace
      if (error.extensions) {
        delete error.extensions.exception;
      }

      // remove "helpful" suggestions
      return {
        ...error,
        message: error.message.replace(/Did you mean (.*)\?/g, "").trim(),
      };
    },

    plugins: [
      getUsageReportingPlugin(config.server?.usageReporting),
      getInlineTracingPlugin(config.server?.inlineTracing),
      getClientIdentifierEnforcementPlugin(config.server?.clientIdentifiers),
      ...getLandingPagePlugins(
        config.server?.landingPage,
        config.server?.playground
      ),
    ].filter(
      /** @type {(x: any) => x is any} */
      (x) => !!x
    ),

    ...validationRules({
      depthLimit: config.server?.depthLimit,
    }),
  };
}

/**
 * @param {import("./schema").PersistedQueries | undefined} config
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
 * @param {import("./schema").UsageReporting | undefined} usageConfig
 * @param {import("./schema").ClientIdentifiers | undefined} [clientIdentifiersConfig]
 */
function getUsageReportingPlugin(usageConfig, clientIdentifiersConfig) {
  if (usageConfig === false) {
    return ApolloServerPluginUsageReportingDisabled();
  }

  /**
   * @template TContext
   * @type {import("apollo-server-core").GenerateClientInfo<TContext> | undefined}
   */
  let generateClientInfo = undefined;
  if (
    clientIdentifiersConfig?.clientNameHeader ||
    clientIdentifiersConfig?.clientVersionHeader
  ) {
    generateClientInfo = ({ request }) => {
      const clientName =
        request.http?.headers?.get(
          clientIdentifiersConfig?.clientNameHeader ??
            "apollographql-client-name"
        ) ?? undefined;

      const clientVersion =
        request.http?.headers?.get(
          clientIdentifiersConfig?.clientVersionHeader ??
            "apollographql-client-version"
        ) ?? undefined;

      return {
        clientName,
        clientVersion,
      };
    };
  }

  if (typeof usageConfig === "object") {
    return ApolloServerPluginUsageReporting({
      ...usageConfig,
      generateClientInfo,
    });
  }

  return null;
}

/**
 * @param {boolean | undefined} config
 */
function getInlineTracingPlugin(config) {
  if (config === false) {
    return ApolloServerPluginInlineTraceDisabled();
  }

  return null;
}

/**
 * @param {import("./schema").ClientIdentifiers | undefined} config
 * @returns {import("apollo-server-core").PluginDefinition | undefined}
 */
function getClientIdentifierEnforcementPlugin(config) {
  if (config?.required) {
    const nameHeader = config.clientNameHeader ?? "apollographql-client-name";
    const versionHeader =
      config.clientVersionHeader ?? "apollographql-client-version";

    const nameRequired =
      typeof config.required === "object" && config.required.clientName;
    const versionRequired =
      typeof config.required === "object" && config.required.clientVersion;

    return {
      requestDidStart({ request }) {
        const name = request?.http?.headers?.has(nameHeader);
        const version = request?.http?.headers?.has(versionHeader);
        if ((nameRequired && !name) || (versionRequired && !version)) {
          throw new ApolloError(
            `client identification headers (${nameHeader}, ${versionHeader}) not provided`,
            "CLIENT_IDENTIFIERS_MISSING"
          );
        }
        return Promise.resolve();
      },
    };
  }
}

/**
 * @param {boolean | undefined} landingPage
 * @param {boolean | { [k: string]: unknown; } | undefined} playground
 */
function getLandingPagePlugins(landingPage, playground) {
  const plugins = [];

  if (landingPage === false) {
    plugins.push(ApolloServerPluginLandingPageDisabled());
  }

  if (playground) {
    plugins.push(
      ApolloServerPluginLandingPageGraphQLPlayground(
        typeof playground === "object" ? playground : {}
      )
    );
  }

  return plugins;
}
