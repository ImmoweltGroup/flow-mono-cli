// @flow

jest.mock('./file.js');

const pathUtils = require('./paths.js');
const file: any = require('./file.js');

describe('pathUtils.resolveMonoRepoRootPath()', () => {
  beforeEach(() => {
    jest.spyOn(pathUtils.utils, 'findUp').mockImplementation(jest.fn(() => '/foo/bar/package.json'));
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof pathUtils.resolveMonoRepoRootPath).toBe('function');
  });

  it('should resolve the nearest package.json of the process and return its basepath', async () => {
    const rootPath = await pathUtils.resolveMonoRepoRootPath();

    expect(rootPath).toContain('/foo/bar');
  });
});

describe('pathUtils.resolveMonoRepoPackagePaths()', () => {
  let globAsync;

  beforeEach(() => {
    jest.spyOn(pathUtils, 'resolveMonoRepoRootPath').mockImplementation(jest.fn(() => '/foo/bar'));
    globAsync = jest.spyOn(pathUtils.utils, 'globAsync').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof pathUtils.resolveMonoRepoPackagePaths).toBe('function');
  });

  it('should resolve the with a list of package paths that have a dependency to "flow-bin"', async () => {
    file.readJson.mockReturnValueOnce({workspaces: ['packages/*']});
    globAsync.mockReturnValueOnce(['/foo/bar/package-a', '/foo/bar/package-b', '/foo/bar/package-c']);
    file.existsAsync
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    file.readJson
      .mockReturnValueOnce({
        dependencies: {},
        devDependencies: {'flow-bin': '1.1.1'}
      })
      .mockReturnValueOnce({
        dependencies: {'flow-bin': '1.1.1'},
        devDependencies: {}
      });

    const packages = await pathUtils.resolveMonoRepoPackagePaths();

    expect(packages).toEqual(['/foo/bar/package-a', '/foo/bar/package-c']);
  });
});
