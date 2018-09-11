// @flow

jest.mock('./../lib/config.js');
jest.mock('./../lib/paths.js');
jest.mock('./../lib/dependency.js');
jest.mock('./../lib/flowTyped.js');
jest.mock('./../lib/logger.js');

const config: any = require('./../lib/config.js');
const path: any = require('./../lib/paths.js');
const dependency: any = require('./../lib/dependency.js');
const flowTyped: any = require('./../lib/flowTyped.js');

const createDependencyFlowTypeStubs = require('./create-stubs.js');

describe('create-stubs', () => {
  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should export an function', () => {
    expect(typeof createDependencyFlowTypeStubs).toBe('function');
  });

  it('should iterate over all dependencies of the resolved packages and create 2nd level stubs for the configured dependency names.', async () => {
    config.resolveAndReadConfig.mockReturnValue({
      'create-stubs': {dependencies: ['foo-package', 'bar-package']}
    });
    path.resolveMonoRepoPackagePaths.mockReturnValue([
      '/foo/bar/package-a',
      '/foo/bar/package-b',
      '/foo/bar/package-c'
    ]);

    dependency.mergeDependenciesIntoList
      .mockReturnValueOnce(['foo-package', 'bar-package', 'baz-package'])
      .mockReturnValueOnce(['foo-package'])
      .mockReturnValueOnce(['baz-package']);

    await createDependencyFlowTypeStubs();

    expect(dependency.readPackageJson.mock.calls).toMatchSnapshot();
    expect(flowTyped.createStubsForInDirectDependencies.mock.calls).toMatchSnapshot();
  });
});
