const { readFile } = require("fs/promises");
const { existsSync } = require("fs");
const { resolve } = require("path");
const { load } = require("js-yaml");
const Ajv = require("ajv");

const APOLLO_GATEWAY_CONFIG_FILE = "/etc/config/gateway.yaml";

/**
 * @returns {Promise<import("./schema.js").ApolloGatewayContainerConfiguration>}
 */
module.exports.fetchConfig = async function fetchConfig() {
  const file =
    process.env.APOLLO_GATEWAY_CONFIG_FILE ?? APOLLO_GATEWAY_CONFIG_FILE;

  if (!existsSync(file)) {
    return {
      server: {},
      gateway: {},
      openTelemetry: undefined,
    };
  }

  const contents = await readFile(file, "utf-8");
  const yaml = load(contents);

  const validate = await getValidator();

  if (validate(yaml)) {
    return yaml;
  }

  throw new Error(
    `Invalid config ${file}\n${(validate.errors ?? [])
      .map((e) => ` - ${e.schemaPath}: ${e.message}`)
      .join("\n")}\n`
  );
};

async function getValidator() {
  // for typescript
  const klass = Ajv.default;
  const ajv = new klass({ allErrors: true });

  const schemaJSON = await readFile(
    resolve(__dirname, "config.schema.json"),
    "utf-8"
  );

  /** @type import("ajv").JSONSchemaType<import("./schema.js").ApolloGatewayContainerConfiguration> */
  const schema = JSON.parse(schemaJSON);

  return ajv.compile(schema);
}
