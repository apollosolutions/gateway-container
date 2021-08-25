/**
 * @param {any} value
 * @param {string | undefined} message
 * @returns {asserts value}
 */
function assert(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

module.exports.assert = assert;
