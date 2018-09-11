// @flow

const fs = require('fs');
const {join} = require('path');
const exec = require('./exec.js');
const dependency = require('./dependency.js');
const {log} = require('./logger.js');

const flowTypedUtils = {
  /**
   * Asynchronously checks if a file exists or not.
   *
   * @param  {Array}   args Arguments that will be propagated to the fs.stat method.
   * @return {Promise}      The Promise that resolves with the boolean.
   */
  parseArgs(argv: {[string]: any} = require('yargs').argv): Array<string> {
    const flowTypedInstallArgs = [
      'flowVersion',
      'overwrite',
      'verbose',
      'skip',
      'packageDir',
      'libdefDir',
      'ignoreDeps'
    ];

    return Object.keys(argv).reduce((args, key) => {
      if (flowTypedInstallArgs.includes(key)) {
        const val = String(argv[key]);
        let arg = `--${key}`;

        if (val && val.length) {
          arg += `=${val}`;
        }

        args.push(arg);
      }

      return args;
    }, []);
  },

  /**
   * Creates stubs for dependencies of a dependency. This is usefull if a package has it's own flow types that require other packages.
   *
   *
   * @param  {[type]}  cwd           [description]
   * @param  {[type]}  dependencyKey [description]
   * @return {Promise}               [description]
   */
  async createStubsForInDirectDependencies(cwd: string, dependencyKey: string) {
    const dependencyPath = join(cwd, 'node_modules', dependencyKey);
    const flowConfigPath = join(cwd, '.flowconfig');
    const hasNoFlowConfigInCwd = fs.existsSync(flowConfigPath) === false;
    const pkg = await dependency.readPackageJson(dependencyPath);
    const dependencies = dependency.mergeDependenciesIntoMap(pkg);
    const dependencyIdentifiers = Object.keys(dependencies)
      // Avoid creating stubs for the dependency itself
      .filter(key => key !== dependencyKey)
      .map(key => `${key}@${dependencies[key]}`);
    const dependencyIdentifiersTree = dependencyIdentifiers
      .map((id, index) => `${index === dependencyIdentifiers.length - 1 ? '└──' : '├──'} ${id}`);

    // Avoid executing an `flow-typed create-stub` without arguments.
    if (!dependencyIdentifiers.length) {
      return;
    }

    log(dependencyKey);
    dependencyIdentifiersTree.forEach(dependencyIdentifier => log(dependencyIdentifier));

    if (hasNoFlowConfigInCwd) {
      fs.writeFileSync(flowConfigPath, '# Intermediate .flowconfig file created by `flow-mono-cli');
    }

    await exec.asyncWithRetries(`flow-typed`, ['create-stub', ...dependencyIdentifiers], {
      preferLocal: true,
      localDir: cwd,
      cwd
    });

    if (hasNoFlowConfigInCwd) {
      fs.unlinkSync(flowConfigPath);
    }
  }
};

module.exports = flowTypedUtils;
