import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { load } from "js-yaml";
import Ajv from "ajv";
import { convertGatewayConfig } from "./gateway.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const CONFIG_FILE = "/etc/apollo/gateway.yaml";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @returns {Promise<import("./types").ApolloGatewayContainerConfigReified>}
 */
export async function fetchConfig() {
  const file = process.env.CONFIG_FILE ?? CONFIG_FILE;

  if (!existsSync(file)) {
    return {
      server: {},
      gateway: await convertGatewayConfig({}),
    };
  }

  const contents = await readFile(file, "utf-8");
  const yaml = load(contents);

  const validate = await getValidator(yaml);

  if (validate(yaml)) {
    return {
      server: yaml.server ?? {},
      gateway: await convertGatewayConfig(yaml),
    };
  }

  throw new Error(
    `Invalid config ${file}\n${JSON.stringify(validate.errors ?? [], null, 2)}`
  );
}

/**
 * @param {any} config
 */
async function getValidator(config) {
  const ajv = new Ajv();

  const schemaJSON = await readFile(
    resolve(__dirname, "configschema.json"),
    "utf-8"
  );

  /** @type import("ajv").JSONSchemaType<import("./schema.js").ApolloGatewayContainerConfig> */
  const schema = JSON.parse(schemaJSON);

  return ajv.compile(schema);
}
