// @flow

jest.mock('./../lib/paths.js');
jest.mock('./../lib/logger.js');
jest.mock('./../lib/dependency.js');
jest.mock('./../lib/flowTyped.js');
jest.mock('./../lib/exec.js');

const path: any = require('./../lib/paths.js');
const dependency: any = require('./../lib/dependency.js');
const flowTyped: any = require('./../lib/flowTyped.js');
const logger: any = require('./../lib/logger.js');
const exec: any = require('./../lib/exec.js');

const installFlowTypes = require('./install-types.js');

describe('install-types', () => {
  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should export an function', () => {
    expect(typeof installFlowTypes).toBe('function');
  });

  it('should update the flow-typed cache and afterwards install types in all packages', async () => {
    path.resolveMonoRepoRootPath.mockReturnValue('/foo');
    path.resolveMonoRepoPackagePaths.mockReturnValue(['/foo/bar', '/foo/baz']);
    flowTyped.parseArgs.mockReturnValue(['--overwrite']);

    await installFlowTypes();

    expect(exec.asyncWithRetries.mock.calls).toMatchSnapshot();
  });

  it('should fatally exit the process if something went wrong during the installation', async () => {
    path.resolveMonoRepoRootPath.mockReturnValue('/foo');
    path.resolveMonoRepoPackagePaths.mockReturnValue(['/foo/bar', '/foo/baz']);
    flowTyped.parseArgs.mockReturnValue(['--overwrite']);
    dependency.readPackageJson.mockReturnValue({name: 'myFooPackageName'});
    exec.asyncWithRetries.mockReturnValueOnce(null).mockReturnValueOnce(Promise.reject(new Error('Foo')));

    await installFlowTypes();

    expect(logger.error.mock.calls).toMatchSnapshot();
  });
});
