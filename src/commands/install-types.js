// @flow

const exec = require('./../lib/exec.js');
const path = require('./../lib/paths.js');
const dependency = require('./../lib/dependency.js');
const flowTyped = require('./../lib/flowTyped.js');
const logger = require('./../lib/logger.js');

module.exports = async function installFlowTypes() {
  const [rootPath, packagePaths] = await Promise.all([
    path.resolveMonoRepoRootPath(),
    path.resolveMonoRepoPackagePaths()
  ]);

  //
  // We will update the flow-typed cache first to avoid errors when running the install step in parallel.
  //
  logger.info(`Updating the global "flow-typed" definitions cache.`);
  await exec.asyncWithRetries(`flow-typed`, ['update-cache'], {
    preferLocal: true,
    localDir: rootPath,
    cwd: rootPath
  });

  logger.info(
    `Installing "flow-typed" definitions for dependencies in ${packagePaths.length} packages.`
  );
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

        logger.fatal(
          `Failed installing "flow-typed" definitions in package "${name}".\n\n`,
          e.message
        );
      }
    })
  );

  logger.success('Installing "flow-typed" definitions done.');
};
