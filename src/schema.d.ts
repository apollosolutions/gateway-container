/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Configuration for Apollo Server and Apollo Gateway running inside a Docker container
 */
export interface ApolloGatewayContainerConfig {
  server?: {
    port?: string;
    host?: string;
    debug?: boolean;
    cors?:
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
    introspection?: boolean;
    usageReporting?:
      | boolean
      | {
          sendVariableValues?:
            | {
                none: boolean;
              }
            | {
                all: boolean;
              }
            | {
                onlyNames: string[];
              }
            | {
                exceptNames: string[];
              };
          sendHeaders?:
            | {
                none: boolean;
              }
            | {
                all: boolean;
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
    inlineTracing?: boolean;
  };
  gateway?: {
    debug?: boolean;
    serviceList?: {
      name: string;
      url: string;
    }[];
    supergraphSdlPath?: string;
    forwardHeaders?: {
      name: string;
      as?: string;
    }[];
    persistedQueries?: boolean;
  };
  openTelemetry?: {
    serviceName: string;
    maxQueueSize?: number;
    scheduledDelayMillis?: number;
  };
}
