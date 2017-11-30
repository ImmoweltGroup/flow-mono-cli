// @flow

const findConfigUp = require('find-config-up');

const _utils = {
  findConfigUp
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
    const config: typeof defaults = await _utils.findConfigUp({
      rawConfigFileName: '.flowmonorc',
      packageJsonProperty: 'flow-mono',
      defaults
    });

    return config;
  }
};

module.exports = config;
