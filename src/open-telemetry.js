const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { Resource } = require("@opentelemetry/resources");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");

/**
 * @param {{
 *  debug?: boolean;
 *  serviceName: string;
 *  maxQueueSize?: number | undefined;
 *  scheduledDelayMillis?: number | undefined;
 *  zipkin?: import("./schema").ZipkinExporter
 * }} params
 * @param {import("./schema").Server | undefined} serverOptions
 */
module.exports.setupOpentelemetry = function setupOpentelemetry(
  { debug, serviceName, maxQueueSize, scheduledDelayMillis, zipkin },
  serverOptions
) {
  if (debug) {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  const resource = new Resource({
    "service.name": serviceName,
  });

  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(resource),
  });

  provider.register();

  // NOTE: keep in sync with getClientIdentifierEnforcementPlugin() in server.js
  const clientNameHeader =
    serverOptions?.clientIdentifiers?.clientNameHeader ??
    "apollographql-client-name";
  const clientVersionHeader =
    serverOptions?.clientIdentifiers?.clientVersionHeader ??
    "apollographql-client-version";

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        requestHook(span, request) {
          if ("headers" in request) {
            span.setAttributes({
              clientName: request.headers[clientNameHeader],
              clientVersion: request.headers[clientVersionHeader],
            });
          }
        },
      }),
      new ExpressInstrumentation(),
    ],
  });

  if (zipkin) {
    const traceExporter = new ZipkinExporter(zipkin);
    provider.addSpanProcessor(
      new BatchSpanProcessor(traceExporter, {
        maxQueueSize: maxQueueSize ?? 1000,
        scheduledDelayMillis: scheduledDelayMillis ?? 1000,
      })
    );
  }
};
