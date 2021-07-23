const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const { Resource } = require("@opentelemetry/resources");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const {
  GraphQLInstrumentation,
} = require("@opentelemetry/instrumentation-graphql");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    // new ExpressInstrumentation(),
    new GraphQLInstrumentation(),
  ],
});

const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      "service.name": "missions",
    })
  ),
});

const traceExporter = new ZipkinExporter({
  url: "http://zipkin:9411/api/v2/spans",
});
provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

provider.register();
