// @flow

const fs = require('fs');
const process = require('process');
const path = require('path');
const {promisify} = require('util');
const {error} = require('./logger.js');

const _utils = {
  readFileAsync: promisify(fs.readFile),
  writeFileAsync: promisify(fs.writeFile),
  accessAsync: promisify(fs.access),
  statAsync: promisify(fs.stat),
  symlinkAsync: promisify(fs.symlink)
};

const fileUtils = {
  _utils,

  async createSymlink(target: string, distDir: string, relative: boolean) {
    const dist = path.join(distDir, path.basename(target));
    const stats = await _utils.statAsync(target);
    // Use a junction on Windows like Yarn do.
    // See: https://github.com/yarnpkg/yarn/blob/fc94a16b7ca90a188d084aef8cea406b60e8c38f/src/util/fs.js#L695-L696
    const type = stats.isDirectory() ? 'junction' : 'file';
    let targetRelative = target;
    if (relative) {
      targetRelative = path.relative(path.dirname(dist), target);
    }

    const currDur = process.cwd();
    process.chdir(distDir);
    await _utils.symlinkAsync(targetRelative, path.basename(target), type);
    process.chdir(currDur);
  },

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
      error(`Failure during parse of "${path}".`, e.message);
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
