// @flow

const mm = require('micromatch');
const config = require('./../lib/config.js');
const path = require('./../lib/paths.js');
const dependency = require('./../lib/dependency.js');
const flowTyped = require('./../lib/flowTyped.js');
const logger = require('./../lib/logger.js');

module.exports = async function createDependencyFlowTypeStubs() {
  const cliConfig = await config.resolveAndReadConfig();
  const packagePaths = await path.resolveMonoRepoPackagePaths();

  for (let cwd of packagePaths) {
    const packageJson = await dependency.readPackageJson(cwd);
    const dependencyKeys = dependency.mergeDependenciesIntoList(packageJson);
    const allowedStubDependencyKeys = mm(
      dependencyKeys,
      cliConfig['create-stubs'].dependencies
    );

    if (!allowedStubDependencyKeys.length) {
      continue;
    }

    logger.info(`Creating in-direct dependency stubs in "${cwd}"`);

    await Promise.all(
      allowedStubDependencyKeys.map(key =>
        flowTyped.createStubsForInDirectDependencies(cwd, key)
      )
    );
  }
};
