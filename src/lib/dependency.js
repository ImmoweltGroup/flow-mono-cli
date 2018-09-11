// @flow

const fs = require('fs');
const {join} = require('path');
const path = require('./paths.js');
const file = require('./file.js');

const dependencyUtils = {
  /**
   * Merges the contents of a `package.json` into a single dependency map.
   *
   * @param  {Object} json                      The contents of a `package.json`.
   * @return {Object}                           The map of all dependencies of the given `package.json`.
   */
  mergeDependenciesIntoMap(json: Object = {}): {[string]: string} {
    return {
      ...(json.dependencies || {}),
      ...(json.devDependencies || {}),
      ...(json.optionalDependencies || {})
    };
  },

  /**
   * Merges the contents of a `package.json` into a list of keys for iterations.
   *
   * @param  {Object} json                      The contents of a `package.json`.
   * @return {Array}                            The list of dependency keys of the given `package.json`.
   */
  mergeDependenciesIntoList(json: Object = {}): Array<string> {
    return Object.keys(this.mergeDependenciesIntoMap(json));
  },

  /**
   * Returns the version string of the given dependency name in the contents of a `package.json` file.
   *
   * @param  {String} key   The name of the dependency for which the function should return the version.
   * @param  {Object} json  The contents of a `package.json`.
   * @return {String}       The semantic versioning version string.
   */
  getDependencyVersion(key: string, json: Object = {}): string {
    const dependencies = this.mergeDependenciesIntoMap(json);

    return dependencies[key];
  },

  /**
   * Reads the contents of a `package.json` and falls back to an empty object if it does not exist.
   *
   * @param  {String} packagePath The full path to the package from which we should require the `package.json`.
   * @return {Object}             The contents of the `package.json`.
   */
  async readPackageJson(packagePath: string): Promise<Object> {
    const filePath = join(packagePath, 'package.json');
    const existsFile = await file.existsAsync(filePath);

    if (existsFile === false) {
      return {};
    }

    return file.readJson(filePath);
  },

  /**
   * Updates the given dependency in the given packagePaths package.json.
   *
   * @param  {String}  packagePath   The full path to the package in which the update should be executed.
   * @param  {String}  dependencyKey The dependency name to update.
   * @param  {String}  version       The version to which the dependency should be bumped.
   * @return {Promise}               The promise that resolves once the update is executed.
   */
  async updateDependency(packagePath: string, dependencyKey: string, version: string) {
    const update = (obj: Object, dependencyType: string, dependencyKey: string, version: string) => {
      if (obj[dependencyType] && obj[dependencyType][dependencyKey]) {
        obj[dependencyType][dependencyKey] = version;
      }

      return obj;
    };
    let json = await this.readPackageJson(packagePath);

    json = update(json, 'dependencies', dependencyKey, version);
    json = update(json, 'devDependencies', dependencyKey, version);
    json = update(json, 'peerDependencies', dependencyKey, version);
    json = update(json, 'optionalDependencies', dependencyKey, version);

    await file.writeFile(join(packagePath, 'package.json'), JSON.stringify(json, null, 2));

    return json;
  },

  /**
   * Checks if a mismatch of the given dependency key is given compared to the one specified in the root package.json.
   *
   * @param  {String}  key         The key/name of the dependency to validate.
   * @param  {String}  packagePath The package path to validate against the root.
   * @return {Promise}             The promise that resolves once the validation finished.
   */
  async hasRootVersionMisMatch(
    key: string,
    packagePath: string
  ): Promise<{
    hasMisMatch: boolean,
    rootVersion: string,
    packageVersion: string
  }> {
    const rootPath = await path.resolveMonoRepoRootPath();
    const [rootPackageJson, packageJson] = await Promise.all([
      this.readPackageJson(rootPath),
      this.readPackageJson(packagePath)
    ]);
    const rootVersion = this.getDependencyVersion(key, rootPackageJson);
    const packageVersion = this.getDependencyVersion(key, packageJson);

    return {
      hasMisMatch: Boolean(rootVersion && packageVersion && packageVersion !== rootVersion),
      rootVersion,
      packageVersion
    };
  },

  /**
   * Checks if the given package name is a scoped dependency.
   *
   * @param  {String}  key The dependency name to validate.
   * @return {Boolean}     The boolean indicating if the given package name is scoped or not.
   */
  isScopedDependency(key: string): boolean {
    return key.startsWith('@') && key.includes('/');
  },

  /**
   * Parses the scope identifier of a package name.
   *
   * @param  {String} key The dependency name to parse.
   * @return {String}     The dependency scope.
   */
  getScopeForDependency(key: string): string {
    return key.split('/').shift();
  },

  /**
   * Ensures that the directory structure for a dependency exists. We made this method synchronous since non-blocking behavior could lead to false-positives in iterations.
   *
   * @param  {String}  key           The package name for which we should create the required directory structure.
   * @param  {String}  directoryPath The package path of the mono repo in which we should create the directory structure.
   * @return {Promise}               A Promise that resolves once the structure is set up.
   */
  ensureDependencyScopeExists(key: string, directoryPath: string) {
    const isScoped = this.isScopedDependency(key);

    if (isScoped) {
      const scope = this.getScopeForDependency(key);
      const scopePath = join(directoryPath, 'node_modules', scope);
      const existsFile = fs.existsSync(scopePath);

      if (existsFile === false) {
        fs.mkdirSync(scopePath);
      }
    }
  },

  /**
   * Creates a symlinks of a dependency from the root into the given package directories `node_modules`.
   * @param  {String}  key        The name of the dependency.
   * @param  {String}  rootDir    The root directory of the mono repo.
   * @param  {String}  packageDir The package directory in whichs `node_modules` folder we should create the symlink.
   * @return {Promise}            A Promise that resolves once the symlink was created.
   */
  async createSymlinkForDependency(key: string, rootDir: string, packageDir: string) {
    this.ensureDependencyScopeExists(key, packageDir);

    const scope = this.getScopeForDependency(key);
    const src = join(rootDir, 'node_modules', key);
    const dist = join(packageDir, 'node_modules', key);
    const distDir = this.isScopedDependency(key)
      ? join(packageDir, 'node_modules', scope)
      : join(packageDir, 'node_modules');
    const [existsSrc, existsDist] = await Promise.all([file.existsAsync(src), file.existsAsync(dist)]);

    // Do not create a symlink if the source folder of the dependency does not exist.
    if (existsSrc === false) {
      return;
    }

    // Do not create a symlink if the dependency was already linked.
    if (existsDist === true) {
      return;
    }

    await file.createSymlink(src, distDir);
  }
};

module.exports = dependencyUtils;
