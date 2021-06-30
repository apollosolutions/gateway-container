import depthLimit from "graphql-depth-limit";

/**
 * @param {{ depthLimit?: import("./schema").DepthLimitValidationRule }} configs
 */
export function validationRules(configs) {
  const validationRules = [];

  if (configs.depthLimit) {
    validationRules.push(depthLimit(configs.depthLimit.maxDepth));
  }

  if (validationRules.length) {
    return { validationRules };
  }
}
