// @flow

const path = require('./../lib/paths.js');
const dependency = require('./../lib/dependency.js');
const logger = require('./../lib/logger.js');

module.exports = async function alignFlowVersions() {
  const packagePaths = await path.resolveMonoRepoPackagePaths();

  logger.info(
    `Aligning dependency versions of "flow-bin" and "flow-typed" in ${packagePaths.length} packages.`
  );

  await Promise.all(
    packagePaths.map(async packagePath => {
      await Promise.all([
        dependency.logVersionMisMatch('flow-bin', packagePath),
        dependency.logVersionMisMatch('flow-typed', packagePath)
      ]);
    })
  );

  logger.success('Aligning dependency versions done.');
};
