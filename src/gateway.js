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
