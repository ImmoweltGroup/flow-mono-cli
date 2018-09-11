// @flow

jest.mock('./file.js');
jest.mock('./logger.js');
jest.mock('./paths.js');

const fs = require('fs');
const file: any = require('./file.js');
const path: any = require('./paths.js');
const dependency = require('./dependency.js');

describe('dependency.mergeDependenciesIntoMap()', () => {
  it('should be a function', () => {
    expect(typeof dependency.mergeDependenciesIntoMap).toBe('function');
  });

  it('should merge the "devDependencies", "dependencies" and "optionalDependencies" into one single map without duplicates', () => {
    const result = dependency.mergeDependenciesIntoMap({
      dependencies: {
        foo: '1.0.0'
      },
      devDependencies: {
        bar: '2.1.0',
        foo: '1.0.0'
      },
      optionalDependencies: {
        baz: '3.7.11'
      }
    });

    expect(result).toEqual({
      bar: '2.1.0',
      foo: '1.0.0',
      baz: '3.7.11'
    });
  });

  it('should not throw errors if no argument was provided', () => {
    expect(() => dependency.mergeDependenciesIntoMap()).not.toThrow();
  });
});

describe('dependency.mergeDependenciesIntoList()', () => {
  it('should be a function', () => {
    expect(typeof dependency.mergeDependenciesIntoList).toBe('function');
  });

  it('should merge the "devDependencies", "dependencies" and "optionalDependencies" into one single list of package names without duplicates', () => {
    const result = dependency.mergeDependenciesIntoList({
      dependencies: {
        foo: '1.0.0'
      },
      devDependencies: {
        bar: '2.1.0',
        foo: '1.0.0'
      },
      optionalDependencies: {
        baz: '3.7.11'
      }
    });

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should not throw errors if no argument was provided', () => {
    expect(() => dependency.mergeDependenciesIntoList()).not.toThrow();
  });
});

describe('dependency.getDependencyVersion()', () => {
  it('should be a function', () => {
    expect(typeof dependency.getDependencyVersion).toBe('function');
  });

  it('should return the version of the given dependency name within the package json.', () => {
    const result = dependency.getDependencyVersion('baz', {
      dependencies: {
        foo: '1.0.0'
      },
      devDependencies: {
        bar: '2.1.0',
        foo: '1.0.0'
      },
      optionalDependencies: {
        baz: '3.7.11'
      }
    });

    expect(result).toEqual('3.7.11');
  });

  it('should not throw errors if no argument was provided', () => {
    expect(() => dependency.mergeDependenciesIntoList()).not.toThrow();
  });
});

describe('dependency.readPackageJson()', () => {
  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof dependency.readPackageJson).toBe('function');
  });

  it('should call the file.readJson function with the given package path and appended package.json filename', async () => {
    file.existsAsync.mockReturnValueOnce(true);
    file.readJson.mockReturnValueOnce({foo: 'bar'});

    const contents = await dependency.readPackageJson('/foo/bar');

    expect(contents).toEqual({foo: 'bar'});
  });

  it('should fallback to an empty object if the file.existsAsync method returns "false"', async () => {
    file.existsAsync.mockReturnValueOnce(false);

    const contents = await dependency.readPackageJson('/foo/bar');

    expect(contents).toEqual({});
  });
});

describe('dependency.updateDependency()', () => {
  let readPackageJson;
  let writeFile;

  beforeEach(() => {
    readPackageJson = jest.spyOn(dependency, 'readPackageJson').mockImplementation(jest.fn());
    writeFile = jest.spyOn(file, 'writeFile').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof dependency.updateDependency).toBe('function');
  });

  it('should align the given version in all dependency maps and write the new file contents to disk', async () => {
    readPackageJson.mockReturnValue({
      name: 'myPackage',
      dependencies: {
        foo: '1.2.0'
      },
      devDependencies: {
        myDependency: '1.0.0'
      },
      peerDependencies: {
        myDependency: '1.0.0'
      }
    });

    await dependency.updateDependency('/foo/packages/bar', 'myDependency', '1.1.0');

    expect(writeFile.mock.calls[0]).toMatchSnapshot();
  });
});

describe('dependency.hasRootVersionMisMatch()', () => {
  let readPackageJson;

  beforeEach(() => {
    readPackageJson = jest.spyOn(dependency, 'readPackageJson').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof dependency.hasRootVersionMisMatch).toBe('function');
  });

  it('should resolve the root and the given packagePaths package.json, compare the given package name version and log out any differences.', async () => {
    path.resolveMonoRepoRootPath.mockReturnValueOnce('/foo');
    readPackageJson
      .mockReturnValueOnce({dependencies: {foo: '1.2.0', bar: '1.0.0'}})
      .mockReturnValueOnce({dependencies: {foo: '1.3.0', bar: '1.0.0'}});

    const results = await dependency.hasRootVersionMisMatch('foo', '/foo/bar');

    expect(results).toEqual({
      hasMisMatch: true,
      rootVersion: '1.2.0',
      packageVersion: '1.3.0'
    });
  });
});

describe('dependency.isScopedDependency()', () => {
  it('should be a function', () => {
    expect(typeof dependency.isScopedDependency).toBe('function');
  });

  it('should return a boolean indicating if the packageName is a scoped dependency or not.', async () => {
    expect(dependency.isScopedDependency('@foo/bar')).toBe(true);
    expect(dependency.isScopedDependency('bar')).toBe(false);
    expect(dependency.isScopedDependency('foo/@bar')).toBe(false);
  });
});

describe('dependency.getScopeForDependency()', () => {
  it('should be a function', () => {
    expect(typeof dependency.getScopeForDependency).toBe('function');
  });

  it('should return the scope of the packageName.', async () => {
    expect(dependency.getScopeForDependency('@foo/bar')).toBe('@foo');
  });
});

describe('dependency.ensureDependencyScopeExists()', () => {
  let isScopedDependency;
  let getScopeForDependency;
  let existsSync;
  let mkdirSync;

  beforeEach(() => {
    isScopedDependency = jest.spyOn(dependency, 'isScopedDependency').mockImplementation(jest.fn(() => false));
    getScopeForDependency = jest.spyOn(dependency, 'getScopeForDependency').mockImplementation(jest.fn(() => '@foo'));
    existsSync = jest.spyOn(fs, 'existsSync').mockImplementation(jest.fn());
    mkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof dependency.ensureDependencyScopeExists).toBe('function');
  });

  it('should create the dependency scope directory if it was not existing in the given package paths node_modules directory.', () => {
    isScopedDependency.mockReturnValue(true);
    getScopeForDependency.mockReturnValue('@foo');
    existsSync.mockReturnValueOnce(false);

    dependency.ensureDependencyScopeExists('@foo/bar', '/some/nested/package/path');

    expect(mkdirSync.mock.calls[0]).toEqual(['/some/nested/package/path/node_modules/@foo']);
  });

  it('should not create the dependency scope directory if the dependency name is not a scoped one.', () => {
    isScopedDependency.mockReturnValue(false);
    existsSync.mockReturnValueOnce(true);

    dependency.ensureDependencyScopeExists('@foo/bar', '/some/nested/package/path');

    expect(mkdirSync.mock.calls.length).toEqual(0);
  });

  it('should not create the dependency scope directory if it already exists.', () => {
    isScopedDependency.mockReturnValue(false);
    getScopeForDependency.mockReturnValue('@foo');
    existsSync.mockReturnValueOnce(true);

    dependency.ensureDependencyScopeExists('@foo/bar', '/some/nested/package/path');

    expect(mkdirSync.mock.calls.length).toEqual(0);
  });
});

describe('dependency.createSymlinkForDependency()', () => {
  let ensureDependencyScopeExists;

  beforeEach(() => {
    ensureDependencyScopeExists = jest.spyOn(dependency, 'ensureDependencyScopeExists').mockImplementation(jest.fn());
    jest.spyOn(dependency, 'getScopeForDependency').mockImplementation(jest.fn(() => '@foo'));
    jest.spyOn(dependency, 'isScopedDependency').mockImplementation(jest.fn(() => false));
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof dependency.createSymlinkForDependency).toBe('function');
  });

  it('should call the file.createSymlink method with the source and target path when called.', async () => {
    file.existsAsync.mockReturnValueOnce(true).mockReturnValueOnce(false);

    await dependency.createSymlinkForDependency('foo', '/foo', '/foo/bar');

    expect(file.createSymlink.mock.calls.length).toBe(1);
    expect(file.createSymlink.mock.calls[0][0]).toBe('/foo/node_modules/foo');
    expect(file.createSymlink.mock.calls[0][1]).toBe('/foo/bar/node_modules');
  });

  it('should ensure that the dependencies directory structure exists.', async () => {
    file.existsAsync.mockReturnValueOnce(true).mockReturnValueOnce(true);

    await dependency.createSymlinkForDependency('bar', '/foo', '/foo/bar');

    expect(ensureDependencyScopeExists.mock.calls.length).toBe(1);
    expect(ensureDependencyScopeExists.mock.calls[0]).toEqual(['bar', '/foo/bar']);
  });

  it('should not call the file.createSymlink method if the source path does not exist.', async () => {
    file.existsAsync.mockReturnValueOnce(false).mockReturnValueOnce(true);

    await dependency.createSymlinkForDependency('baz', '/foo', '/foo/bar');

    expect(file.createSymlink.mock.calls.length).toBe(0);
  });

  it('should not call the file.createSymlink method if the dist path does already exist.', async () => {
    file.existsAsync.mockReturnValueOnce(true).mockReturnValueOnce(true);

    await dependency.createSymlinkForDependency('qux', '/foo', '/foo/bar');

    expect(file.createSymlink.mock.calls.length).toBe(0);
  });
});
