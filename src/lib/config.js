// @flow

const cosmiconfig = require('cosmiconfig');
const merge = require('lodash.merge');

const utils = {
  cosmiconfig
};
const defaults = {
  flowTypedCommandExecRetries: 1,
  'create-symlinks': {
    ignore: []
  },
  'create-stubs': {
    dependencies: []
  }
};

const config = {
  utils,

  async resolveAndReadConfig(): Promise<typeof defaults> {
    const explorer = utils.cosmiconfig('flow-mono', {
      searchPlaces: [
        'package.json',
        '.flowmonorc',
        '.flowmonorc.json',
        '.flowmonorc.yaml',
        '.flowmonorc.yml',
        '.flowmonorc.js',
        'flowmono.config.js'
      ]
    });
    const results = await explorer.search();

    return results && results.config ? merge({}, defaults, results.config) : defaults;
  }
};

module.exports = config;
