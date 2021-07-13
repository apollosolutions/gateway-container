const { RemoteGraphQLDataSource } = require("@apollo/gateway");
const { existsSync } = require("fs");
const { readFile, stat } = require("fs/promises");
const crypto = require("crypto");

/**
 * @param {import("./schema").ApolloGatewayContainerConfiguration | null} config
 * @returns {Promise<import("@apollo/gateway").GatewayConfig>}
 */
module.exports.convertGatewayConfig = async function convertGatewayConfig(
  config
) {
  return {
    ...(config?.gateway ?? {}),
    ...(await subgraphConfig(config)),
    buildService({ name, url }) {
      return createDataSource({
        name,
        url,
        forwardHeaders: config?.gateway?.forwardHeaders,
        apq: config?.gateway?.persistedQueries,
      });
    },
  };
};

/**
 * @param {import("./schema").ApolloGatewayContainerConfiguration | null} config
 * @returns {Promise<import("@apollo/gateway").GatewayConfig>}
 */
async function subgraphConfig(config) {
  if (config?.gateway?.serviceList) {
    return {
      serviceList: config.gateway.serviceList,
    };
  }

  const supergraphSdlPath =
    config?.gateway?.supergraphSdlPath ??
    process.env.APOLLO_SCHEMA_CONFIG_EMBEDDED;

  if (supergraphSdlPath) {
    return {
      experimental_pollInterval: 10000,
      async experimental_updateSupergraphSdl() {
        if (!existsSync(supergraphSdlPath)) {
          throw new Error(
            `cannot find supergraph sdl file ${supergraphSdlPath}`
          );
        }

        const supergraphSdl = await readFile(supergraphSdlPath, "utf-8");

        const id = crypto
          .createHash("sha256")
          .update(supergraphSdl)
          .digest("hex");

        return {
          id,
          supergraphSdl,
        };
      },
    };
  }

  return {};
}

// Borrowed from istio demo https://github.com/istio/istio/blob/62c094676c7dbdd9daeacb5795dddc049d49afee/samples/bookinfo/src/reviews/reviews-application/src/main/java/application/rest/LibertyRestEndpoint.java#L46
const AUTO_FORWARDED_HEADERS = [
  "x-request-id",

  // Lightstep tracing header.
  "x-ot-span-context",

  // Datadog tracing header.
  "x-datadog-trace-id",
  "x-datadog-parent-id",
  "x-datadog-sampling-priority",

  // W3C Trace Context.
  "traceparent",
  "tracestate",

  // Cloud trace context.
  "x-cloud-trace-context",

  // Grpc binary trace context.
  "grpc-trace-bin",

  // b3 trace headers. Compatible with Zipkin, OpenCensusAgent, and
  // Stackdriver Istio configurations.
  "x-b3-traceid",
  "x-b3-spanid",
  "x-b3-parentspanid",
  "x-b3-sampled",
  "x-b3-flags",
];

/**
 * @param {{
 *  name: string;
 *  url: string | undefined;
 *  forwardHeaders?: import("./schema").ForwardHeaders;
 *  apq: boolean | undefined;
 * }} params
 * @returns {import("@apollo/gateway").GraphQLDataSource}
 */
function createDataSource({ name: subgraphName, url, forwardHeaders, apq }) {
  class DataSource extends RemoteGraphQLDataSource {
    /**
     * @param {{ url: string | undefined; apq: boolean | undefined }} params
     */
    constructor({ url, apq }) {
      super({ url, apq });
    }

    /**
     * @param {{ request: any; context: import("apollo-server-express").ExpressContext; }} params
     */
    willSendRequest({ request, context }) {
      for (const header of AUTO_FORWARDED_HEADERS) {
        request.http.headers.set(header, context.req?.header(header));
      }

      if (forwardHeaders) {
        for (const config of forwardHeaders) {
          const onlySubgraphs =
            config.subgraphs && "only" in config.subgraphs
              ? config.subgraphs.only
              : [subgraphName];
          const exceptSubgraphs =
            config.subgraphs && "except" in config.subgraphs
              ? config.subgraphs.except
              : [];

          if (
            exceptSubgraphs.includes(subgraphName) ||
            !onlySubgraphs.includes(subgraphName)
          ) {
            continue;
          }

          if ("all" in config && config.all && context.req) {
            for (const [name, value] of Object.entries(context.req.headers)) {
              if (config.except?.includes(name)) {
                continue;
              }

              request.http.headers.set(name, value);
            }
          } else if ("name" in config) {
            let value = context.req?.header(config.name);
            if (typeof config.value === "string") {
              value = config.value;
            } else if (
              typeof config.value === "object" &&
              "env" in config.value
            ) {
              value = process.env[config.value.env];
            } else if (
              typeof config.value === "object" &&
              "header" in config.value
            ) {
              value = context.req?.header(config.value.header);
            }

            request.http.headers.set(config.name, value);
          }
        }
      }
    }
  }

  return new DataSource({ url, apq });
}
