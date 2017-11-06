// @flow

const fs = require('fs');
const makeSymlinks = require('make-symlinks');
const {promisify} = require('util');
const logger = require('./logger.js');

const _utils = {
  readFileAsync: promisify(fs.readFile),
  writeFileAsync: promisify(fs.writeFile),
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

  /**
   * Reads and parses a json file asynchronously.
   *
   * @param  {String}  path The Path to the JSON file.
   * @return {Promise}      The Promise that resolves with the file contents.
   */
  async readJson(path: string | any): Promise<Object> {
    try {
      const contents = await _utils.readFileAsync(path, 'utf8');

      return JSON.parse(contents);
    } catch (e) {
      logger.fatal(`Failure during parse of "${path}".`, e.message);
    }

    return {};
  },

  /**
   * Writes the contents to the given destination.
   *
   * @param  {String}  path     The path to the file.
   * @param  {*}       contents The contents to write.
   * @param  {String}  encoding An optional encoding to use.
   * @return {Promise}          The promise that resolves once the file was written.
   */
  async writeFile(path: string, contents: any, encoding?: string = 'utf8') {
    await _utils.writeFileAsync(path, contents, 'utf8');

    return contents;
  }
};

module.exports = fileUtils;
