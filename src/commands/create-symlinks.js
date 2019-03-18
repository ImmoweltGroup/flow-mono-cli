// @flow

const mm = require('micromatch');
const {join} = require('path');
const config = require('./../lib/config.js');
const path = require('./../lib/paths.js');
const dependency = require('./../lib/dependency.js');
const file = require('./../lib/file.js');
const {info, success} = require('./../lib/logger.js');

module.exports = async function createFlowTypeSymlinks(
  {flowConfigPath, includePeerDependencies}: {
    flowConfigPath: string,
    includePeerDependencies: boolean
  },
  cwd?: string = process.cwd()
) {
  const cliConfig = await config.resolveAndReadConfig();
  const absoluteFlowConfigPath = join(cwd, flowConfigPath);

  info('Creating symlinks to the defined ".flowconfig" and dependencies to all packages with a "flow-bin" dependency');

  const [rootPath, packagePaths] = await Promise.all([
    path.resolveMonoRepoRootPath(),
    path.resolveMonoRepoPackagePaths()
  ]);

  await Promise.all(
    packagePaths.map(async packagePath => {
      const existsFlowConfig = await file.existsAsync(join(packagePath, '.flowconfig'));

      if (existsFlowConfig === false) {
        await file.createSymlink(absoluteFlowConfigPath, packagePath);
      }

      const packageJson = await dependency.readPackageJson(packagePath);
      const dependencyKeys = dependency.mergeDependenciesIntoList(packageJson, includePeerDependencies);
      const ignoredPackageKeys = mm(dependencyKeys, cliConfig['create-symlinks'].ignore);

      await Promise.all(
        dependencyKeys.filter(key => ignoredPackageKeys.includes(key) === false).map(key => {
          return dependency.createSymlinkForDependency(key, rootPath, packagePath);
        })
      );
    })
  );

  success(`Symlinked all direct dependencies of ${packagePaths.length} packages`);
};
