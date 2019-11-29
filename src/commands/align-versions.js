// @flow

const inquirer = require('inquirer');
const path = require('./../lib/paths.js');
const dependency = require('./../lib/dependency.js');
const {info, success} = require('./../lib/logger.js');

async function checkVersionAndPromptUpdate(dependencyKey, packagePath) {
  const rootPath = await path.resolveMonoRepoRootPath();
  const relativePackagePath = packagePath.replace(rootPath, '');
  const {hasMisMatch, rootVersion} = await dependency.hasRootVersionMisMatch(dependencyKey, packagePath);

  if (hasMisMatch) {
    const answers = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldUpdateDependency',
      message: `Should we align the version of "${dependencyKey}" in package "${relativePackagePath}"?`,
      default: false
    });

    if (answers.shouldUpdateDependency) {
      await dependency.updateDependency(packagePath, dependencyKey, rootVersion);
    }
  } else {
    success(`Dependency "${dependencyKey}" in package "${relativePackagePath}" is of the same version`);
  }
}

async function alignFlowVersions() {
  const packagePaths = await path.resolveMonoRepoPackagePaths();

  info(`Aligning dependency versions of "flow-bin" and "flow-typed" in ${packagePaths.length} packages`);

  for (const packagePath of packagePaths) {
    await checkVersionAndPromptUpdate('flow-bin', packagePath);
    await checkVersionAndPromptUpdate('flow-typed', packagePath);
  }

  success('Aligned dependency versions');
}

module.exports = alignFlowVersions;
