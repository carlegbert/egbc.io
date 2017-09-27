/* eslint-env browser */

/**
 * Classes such as Shell and Vi hold references to DOM selectors.
 * The selector functions in this file allow us to create instances
 * of those classes in environments that don't have access to a DOM,
 * eg, for unit testing purposes.
 */

function getElementById(id) {
  try {
    return document.getElementById(id);
  } catch (err) {
    // return empty object that can have properties assigned to it
    // without throwing an exception
    return {};
  }
}

module.exports = {
  getElementById,
};
