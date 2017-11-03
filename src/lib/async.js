// @flow

const logger = require('./logger.js');

const asyncUtils = {
  /**
   * Executes a function that returns a Promise with the provided argumens and automatically catches failures.
   *
   * @param  {Function} fn   The function to execute.
   * @param  {Array}    args The arguments to propagate to the function.
   * @return {Promise}       The Promise that resolves once the function has been resolved.
   */
  exec(fn: Function, ...args: Array<any>) {
    return fn(...args).catch(e => logger.fatal(e.message));
  }
};

module.exports = asyncUtils;
