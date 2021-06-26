import { RemoteGraphQLDataSource } from "@apollo/gateway";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

/**
 * @param {import("./schema").ApolloGatewayContainerConfig | null} config
 * @returns {Promise<import("@apollo/gateway").GatewayConfig>}
 */
export async function convertGatewayConfig(config) {
  return {
    ...(config?.gateway ?? {}),
    ...(await subgraphConfig(config)),
    buildService({ name, url }) {
      return createDataSource({
        url,
        forwardHeaders: config?.gateway?.forwardHeaders,
      });
    },
  };
}

/**
 * @param {import("./schema").ApolloGatewayContainerConfig | null} config
 * @returns {Promise<import("@apollo/gateway").GatewayConfig>}
 */
async function subgraphConfig(config) {
  if (config?.gateway?.serviceList) {
    return {
      serviceList: config.gateway.serviceList,
    };
  }

  if (config?.gateway?.supergraphSdlPath) {
    if (!existsSync(config.gateway.supergraphSdlPath)) {
      throw new Error(
        `cannot find supergraph sdl file ${config.gateway.supergraphSdlPath}`
      );
    }
    return {
      supergraphSdl: await readFile(config.gateway.supergraphSdlPath, "utf-8"),
    };
  }

  if (process.env.SUPERGRAPH_SDL_PATH) {
    if (!existsSync(process.env.SUPERGRAPH_SDL_PATH)) {
      throw new Error(
        `cannot find supergraph sdl file ${process.env.SUPERGRAPH_SDL_PATH}`
      );
    }
    return {
      supergraphSdl: await readFile(process.env.SUPERGRAPH_SDL_PATH, "utf-8"),
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
 *  url: string | undefined;
 *  forwardHeaders: import("./types").ForwardHeadersConfig
 * }} params
 * @returns {import("@apollo/gateway").GraphQLDataSource}
 */
function createDataSource({ url, forwardHeaders }) {
  class DataSource extends RemoteGraphQLDataSource {
    /**
     * @param {{ request: any; context: import("apollo-server-express").ExpressContext; }} params
     */
    willSendRequest({ request, context }) {
      for (const header of AUTO_FORWARDED_HEADERS) {
        request.http.headers.set(header, context.req?.header(header));
      }

      if (forwardHeaders) {
        for (const fwd of forwardHeaders) {
          request.http.headers.set(
            fwd.as ?? fwd.name,
            context.req?.header(fwd.name)
          );
        }
      }
    }
  }

  return new DataSource({ url });
}
