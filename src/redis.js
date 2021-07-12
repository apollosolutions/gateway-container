/**
 * @param {import("./schema").RedisClient} config
 */
module.exports.reifyConfig = function reifyConfig(config) {
  return {
    ...config,
    password: config.password?.env
      ? process.env[config.password.env]
      : undefined,
  };
};
