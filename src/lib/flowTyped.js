// @flow

const {join} = require('path');
const exec = require('./exec.js');
const dependency = require('./dependency.js');
const logger = require('./logger.js');

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
    const pkg = await dependency.readPackageJson(dependencyPath);
    const dependencies = dependency.mergeDependenciesIntoMap(pkg);
    // Avoid creating stubs for the dependency itself
    const filteredDependencyKeys = Object.keys(dependencies).filter(
      key => key !== dependencyKey
    );
    const dependencyIdentifiers = filteredDependencyKeys.map(key => {
      const version = dependencies[key];

      return `${key}@${version}`;
    });

    // Avoid executing an `flow-typed create-stub` without arguments.
    if (!dependencyIdentifiers.length) {
      return;
    }

    const dependencyIdentifiersTree = dependencyIdentifiers
      .map(
        (id, index) =>
          `${index === dependencyIdentifiers.length - 1
            ? '    └──'
            : '    ├──'} ${id}`
      )
      .join('\n');
    logger.info(`    ${dependencyKey}
${dependencyIdentifiersTree}`);

    await exec.async(`flow-typed`, ['create-stub', ...dependencyIdentifiers], {
      preferLocal: true,
      localDir: cwd,
      cwd
    });
  }
};

module.exports = flowTypedUtils;
