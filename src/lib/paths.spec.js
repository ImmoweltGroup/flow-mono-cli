// @flow

jest.mock('./file.js');

const pathUtils = require('./paths.js');
const file: any = require('./file.js');

describe('pathUtils.resolveMonoRepoRootPath()', () => {
  let findUp;

  beforeEach(() => {
    findUp = jest
      .spyOn(pathUtils._utils, 'findUp')
      .mockImplementation(jest.fn(() => '/foo/bar/package.json'));
  });

  afterEach(() => {
    findUp.mockRestore();
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
  let resolveMonoRepoRootPath;
  let globAsync;

  beforeEach(() => {
    resolveMonoRepoRootPath = jest
      .spyOn(pathUtils, 'resolveMonoRepoRootPath')
      .mockImplementation(jest.fn(() => '/foo/bar'));
    globAsync = jest
      .spyOn(pathUtils._utils, 'globAsync')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    resolveMonoRepoRootPath.mockRestore();
    globAsync.mockRestore();
    file.readJson.mockReset();
    file.existsAsync.mockReset();
  });

  it('should be a function', () => {
    expect(typeof pathUtils.resolveMonoRepoPackagePaths).toBe('function');
  });

  it('should resolve the with a list of package paths that have a dependency to "flow-bin"', async () => {
    file.readJson.mockReturnValueOnce({workspaces: ['packages/*']});
    globAsync.mockReturnValueOnce([
      '/foo/bar/package-a',
      '/foo/bar/package-b',
      '/foo/bar/package-c'
    ]);
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
