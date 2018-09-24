// @flow

const {start} = require('ora');
const {error} = require('./logger.js');

const asyncUtils = {
  /**
   * Executes a function that returns a Promise with the provided argumens and automatically catches failures.
   *
   * @param  {Function} fn   The function to execute.
   * @param  {Array}    args The arguments to propagate to the function.
   * @return {Promise}       The Promise that resolves once the function has been resolved.
   */
  exec(fn: Function, ...args: Array<any>) {
    const spinner = start();
    return fn(...args)
      .then(() => spinner.stop())
      .catch(e => {
        spinner.stop();
        error(e.message);
      });
  }
};

module.exports = asyncUtils;
