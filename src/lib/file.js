// @flow

const fs = require('fs');
const makeSymlinks = require('make-symlinks');
const {promisify} = require('util');
const logger = require('./logger.js');

const _utils = {
  readFileAsync: promisify(fs.readFile),
  accessAsync: promisify(fs.access)
};

const fileUtils = {
  _utils,

  createSymlink: makeSymlinks,

  /**
   * Asynchronously checks if a file exists or not.
   *
   * @param  {Array}   args Arguments that will be propagated to the fs.stat method.
   * @return {Promise}      The Promise that resolves with the boolean.
   */
  async existsAsync(...args: Array<any>): Promise<boolean> {
    try {
      await _utils.accessAsync(...args);
      return true;
    } catch (e) {
      return false;
    }
  },

  async readJson(path: string | any): Promise<Object> {
    try {
      const contents = await _utils.readFileAsync(path, 'utf8');

      return JSON.parse(contents);
    } catch (e) {
      logger.fatal(`Failure during parse of "${path}".`, e.message);
    }

    return {};
  }
};

module.exports = fileUtils;
