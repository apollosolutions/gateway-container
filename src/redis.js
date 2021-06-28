/**
 * @param {import("./schema").RedisClientConfig} config
 */
export function reifyConfig(config) {
  return {
    ...config,
    password: config.password?.env
      ? process.env[config.password.env]
      : undefined,
  };
}
