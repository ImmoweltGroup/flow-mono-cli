// @flow

const exec = require('./../lib/exec.js');
const path = require('./../lib/paths.js');
const dependency = require('./../lib/dependency.js');
const flowTyped = require('./../lib/flowTyped.js');
const {info, success, error} = require('./../lib/logger.js');

module.exports = async function installFlowTypes() {
  const [packagePaths] = await Promise.all([
    path.resolveMonoRepoPackagePaths()
  ]);

  info(`Installing "flow-typed" definitions for dependencies in ${packagePaths.length} packages`);
  await Promise.all(
    packagePaths.map(async packagePath => {
      try {
        const args = flowTyped.parseArgs();

        await exec.asyncWithRetries(`flow-typed`, ['install'].concat(args), {
          preferLocal: true,
          localDir: packagePath,
          cwd: packagePath
        });
      } catch (e) {
        const {name} = await dependency.readPackageJson(packagePath);

        error(`Failed installing "flow-typed" definitions in package "${name}"`, e.message);
        console.error(e)
      }
    })
  );

  success('Installed "flow-typed" definitions');
};
