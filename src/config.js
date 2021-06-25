import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { load } from "js-yaml";
import Ajv from "ajv";
import { convertGatewayConfig } from "./gateway.js";
import { convertServerConfig } from "./server.js";

const CONFIG_FILE = "/etc/apollo/gateway.yaml";
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @returns {Promise<import("./types").ApolloGatewayContainerConfigReified>}
 */
export async function fetchConfig() {
  const file = process.env.CONFIG_FILE ?? CONFIG_FILE;

  if (!existsSync(file)) {
    return {
      server: convertServerConfig({}),
      gateway: await convertGatewayConfig({}),
    };
  }

  const contents = await readFile(file, "utf-8");
  const yaml = load(contents);

  const validate = await getValidator(yaml);

  if (validate(yaml)) {
    return {
      server: convertServerConfig(yaml),
      gateway: await convertGatewayConfig(yaml),
    };
  }

  throw new Error(
    `Invalid config ${file}\n${(validate.errors ?? [])
      .map((e) => ` - ${e.schemaPath}: ${e.message}`)
      .join("\n")}\n`
  );
}

/**
 * @param {any} config
 */
async function getValidator(config) {
  const ajv = new Ajv({ allErrors: true });

  const schemaJSON = await readFile(
    resolve(__dirname, "configschema.json"),
    "utf-8"
  );

  /** @type import("ajv").JSONSchemaType<import("./schema.js").ApolloGatewayContainerConfig> */
  const schema = JSON.parse(schemaJSON);

  return ajv.compile(schema);
}
