// @flow

const {join} = require('path');
const glob = require('glob');
const {promisify} = require('util');
const findUp = require('find-up');
const file = require('./file.js');

const utils = {
  findUp,
  globAsync: promisify(glob)
};

const pathUtils = {
  utils,

  /**
   * Resolves the mono repo root by traveling up the cwd until it find's the `package.json`.
   *
   * @return {Promise}       The Promise that resolves with the complete path to the mono repo.
   */
  async resolveMonoRepoRootPath(): Promise<string> {
    const pkgJsonPath = await utils.findUp('package.json');

    return pkgJsonPath.replace('package.json', '');
  },

  /**
   * Resolves all full paths to the mono repos packages that have a dependency to flow.
   *
   * @return {Promise}       The Promise that resolves with the list of complete paths to all mono repo packages.
   */
  async resolveMonoRepoPackagePaths(): Promise<Array<string>> {
    const rootPath = await this.resolveMonoRepoRootPath();
    const {workspaces = []} = await file.readJson(join(rootPath, 'package.json'));
    const workspacesArray = Array.isArray(workspaces) ? workspaces : workspaces.packages || [];
    const packagePaths = [];

    await Promise.all(
      workspacesArray.map(async pattern => {
        const paths = await utils.globAsync(join(rootPath, pattern));

        await Promise.all(
          paths.map(async packagePath => {
            const packageJsonPath = join(packagePath, 'package.json');
            const existsPackageJson = await file.existsAsync(packageJsonPath);

            if (!existsPackageJson) {
              return false;
            }

            const {dependencies = {}, devDependencies = {}} = await file.readJson(packageJsonPath);

            if (dependencies['flow-bin'] || devDependencies['flow-bin']) {
              packagePaths.push(packagePath);
            }

            return true;
          })
        );
      })
    );

    return packagePaths;
  }
};

module.exports = pathUtils;
