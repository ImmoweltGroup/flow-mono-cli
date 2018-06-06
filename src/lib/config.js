// @flow

const cosmiconfig = require('cosmiconfig');
const merge = require('lodash.merge');

const _utils = {
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
  _utils,

  async resolveAndReadConfig(): Promise<typeof defaults> {
    const explorer = _utils.cosmiconfig('flow-mono', {
      searchPlaces: [
        'package.json',
        '.flowmonorc',
        `.flowmonorc.json`,
        `.flowmonorc.yaml`,
        `.flowmonorc.yml`,
        `.flowmonorc.js`,
        `flowmono.config.js`
      ]
    });
    const results = await explorer.search();

    return merge({}, defaults, results.config);
  }
};

module.exports = config;
