// @flow

// ToDo: Extract into it's own package.

const merge = require('lodash/merge');
const findUp = require('find-up');
const file = require('./file.js');

const _utils = {
  findUp
};
const defaults = {
  'create-symlinks': {
    ignore: []
  },
  'create-stubs': {
    dependencies: []
  }
};

const config = {
  defaults,
  _utils,

  async findPkgConfigUp(cwd: string) {
    const filePath = await _utils.findUp('package.json', {cwd});
    const pkg = await file.readJson(filePath);

    const config = pkg['flow-mono'];

    if (typeof config === 'object') {
      return config;
    }

    const pathPartials = cwd.split('/');
    pathPartials.pop();

    return this.findPkgConfigUp(pathPartials.join('/'));
  },

  async resolveAndReadConfig(cwd?: string): Promise<typeof defaults> {
    const rawConfigPath = await _utils.findUp('.monoflowrc', {cwd});
    let config;

    if (rawConfigPath && rawConfigPath.length) {
      config = await file.readJson(rawConfigPath);
    } else {
      config = await this.findPkgConfigUp(process.cwd());
    }

    return merge({}, defaults, config);
  }
};

module.exports = config;
