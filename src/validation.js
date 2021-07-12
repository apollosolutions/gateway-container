const depthLimit = require("graphql-depth-limit");

/**
 * @param {{ depthLimit?: import("./schema").DepthLimitValidationRule }} configs
 */
module.exports.validationRules = function validationRules(configs) {
  const validationRules = [];

  if (configs.depthLimit) {
    validationRules.push(depthLimit(configs.depthLimit.maxDepth));
  }

  if (validationRules.length) {
    return { validationRules };
  }
};
