/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type CORS =
  | boolean
  | {
      origin?: string | string[];
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    };
export type UsageReporting =
  | boolean
  | {
      sendVariableValues?:
        | {
            none: true;
          }
        | {
            all: true;
          }
        | {
            onlyNames: string[];
          }
        | {
            exceptNames: string[];
          };
      sendHeaders?:
        | {
            none: true;
          }
        | {
            all: true;
          }
        | {
            onlyNames: string[];
          }
        | {
            exceptNames: string[];
          };
      sendUnexecutableOperationDocuments?: boolean;
      sendReportsImmediately?: boolean;
      reportIntervalMs?: number;
      maxUncompressedReportSize?: number;
      maxAttempts?: number;
      minimumRetryDelayMs?: number;
    };
/**
 * Either false, or { ttl: number; redis: https://github.com/luin/ioredis/blob/HEAD/API.md#new_Redis }
 */
export type PersistedQueries =
  | false
  | {
      ttl?: number;
      redis?: RedisClient;
    };
export type ServiceList = {
  name: string;
  url: string;
}[];
export type ForwardHeaders = (AllHeaders | SpecificHeader)[];

/**
 * Configuration for Apollo Server and Apollo Gateway running inside a Docker container
 */
export interface ApolloGatewayContainerConfiguration {
  server?: Server;
  gateway?: Gateway;
  openTelemetry?: OpenTelemetry;
}
export interface Server {
  port?: string;
  host?: string;
  debug?: boolean;
  cors?: CORS;
  introspection?: boolean;
  usageReporting?: UsageReporting;
  inlineTracing?: boolean;
  persistedQueries?: PersistedQueries;
  depthLimit?: DepthLimitValidationRule;
  clientIdentifiers?: ClientIdentifiers;
  requireOperationNames?: boolean;
  landingPage?: boolean;
  playground?:
    | true
    | {
        [k: string]: unknown;
      };
  errors?: ErrorOptions;
}
export interface RedisClient {
  port?: number;
  host?: string;
  family?: number;
  path?: string;
  keepAlive?: number;
  noDelay?: boolean;
  connectionName?: string;
  db?: number;
  password?: {
    /**
     * Name of environment variable
     */
    env: string;
  };
  username?: string;
  dropBufferSupport?: boolean;
  enableReadyCheck?: boolean;
  enableOfflineQueue?: boolean;
  connectTimeout?: number;
  disconnectTimeout?: number;
  commandTimeout?: number;
  autoResubscribe?: boolean;
  autoResendUnfulfilledCommands?: boolean;
  lazyConnect?: boolean;
  tls?: {
    [k: string]: unknown;
  };
  keyPrefix?: string;
  maxRetriesPerRequest?: number;
  stringNumbers?: boolean;
  enableAutoPipelining?: boolean;
  autoPipeliningIgnoredCommands?: string[];
  maxScriptsCachingTime?: number;
}
/**
 * Configuration for https://github.com/stems/graphql-depth-limit
 */
export interface DepthLimitValidationRule {
  maxDepth: number;
}
export interface ClientIdentifiers {
  required?:
    | boolean
    | {
        clientName?: true;
        clientVersion?: true;
      };
  clientNameHeader?: string;
  clientVersionHeader?: string;
}
export interface ErrorOptions {
  removeStacktrace?: boolean;
  removeSuggestions?: boolean;
  mask?: {
    message:
      | {
          matches: string;
        }
      | {
          startsWith: string;
        };
  }[];
}
export interface Gateway {
  debug?: boolean;
  serviceList?: ServiceList;
  supergraphSdl?: SupergraphConfig;
  forwardHeaders?: ForwardHeaders;
  persistedQueries?: boolean;
}
export interface SupergraphConfig {
  path: string;
  hotReload?: boolean;
  hotReloadIntervalMs?: number;
}
export interface AllHeaders {
  all: true;
  except?: string[];
  subgraphs?:
    | {
        only: string[];
      }
    | {
        except: string[];
      };
}
export interface SpecificHeader {
  name: string;
  value?:
    | string
    | {
        env: string;
      }
    | {
        header: string;
      };
  subgraphs?:
    | {
        only: string[];
      }
    | {
        except: string[];
      };
}
export interface OpenTelemetry {
  debug?: boolean;
  serviceName: string;
  maxQueueSize?: number;
  scheduledDelayMillis?: number;
  zipkin?: ZipkinExporter;
}
export interface ZipkinExporter {
  headers?: {
    [k: string]: string;
  };
  serviceName?: string;
  url?: string;
  statusCodeTagName?: string;
  statusDescriptionTagName?: string;
}
