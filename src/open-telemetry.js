import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { BatchSpanProcessor } from "@opentelemetry/tracing";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { NodeTracerProvider } from "@opentelemetry/node";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";

/**
 * @param {{
 *  serviceName: string;
 *  maxQueueSize?: number | undefined;
 *  scheduledDelayMillis?: number | undefined;
 *  zipkin?: import("./schema").ZipkinExporterConfig
 * }} params
 */
export function setupOpentelemetry({
  serviceName,
  maxQueueSize,
  scheduledDelayMillis,
  zipkin,
}) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

  const resource = new Resource({
    "service.name": serviceName,
  });

  /** @type {import("@opentelemetry/instrumentation").Instrumentation[]} */
  const instrumentations = [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ];

  registerInstrumentations({
    instrumentations: [instrumentations],
  });

  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(resource),
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

  provider.register();
}
