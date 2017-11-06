// @flow

jest.mock('./../lib/config.js');
jest.mock('./../lib/logger.js');
jest.mock('./../lib/dependency.js');
jest.mock('./../lib/paths.js');
jest.mock('./../lib/file.js');

const config: any = require('./../lib/config.js');
const path: any = require('./../lib/paths.js');
const dependency: any = require('./../lib/dependency.js');
const file: any = require('./../lib/file.js');

const createFlowTypeSymlinks = require('./create-symlinks.js');

describe('create-symlinks', () => {
  afterEach(() => {
    config.resolveAndReadConfig.mockReset();
    path.resolveMonoRepoPackagePaths.mockReset();
    path.resolveMonoRepoPackagePaths.mockReset();
    file.existsAsync.mockReset();
  });

  it('should export an function', () => {
    expect(typeof createFlowTypeSymlinks).toBe('function');
  });

  it('should create symlinks for the .flowconfig for each package as well as symlinks for the dependencies', async () => {
    config.resolveAndReadConfig.mockReturnValue({
      'create-symlinks': {ignore: ['foo-dependency', 'bar-dependency']}
    });
    path.resolveMonoRepoRootPath.mockReturnValue('/foo');
    path.resolveMonoRepoPackagePaths.mockReturnValue(['/foo/bar', '/foo/baz']);
    file.existsAsync.mockReturnValueOnce(true).mockReturnValue(false);
    dependency.readPackageJson.mockReturnValue({});
    dependency.mergeDependenciesIntoList.mockReturnValue([
      'foo-dependency',
      'bar-dependency',
      'baz-dependency'
    ]);

    await createFlowTypeSymlinks('/foo/.flowconfig', '/usr/app');

    expect(file.createSymlink.mock.calls).toMatchSnapshot();
    expect(dependency.createSymlinkForDependency.mock.calls).toMatchSnapshot();
  });
});
