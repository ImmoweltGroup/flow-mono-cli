// @flow

jest.mock('./../lib/paths.js');
jest.mock('./../lib/dependency.js');
jest.mock('./../lib/logger.js');

const path: any = require('./../lib/paths.js');
const dependency: any = require('./../lib/dependency.js');

const alignFlowVersions = require('./align-versions.js');

describe('align-versions', () => {
  it('should export an function', () => {
    expect(typeof alignFlowVersions).toBe('function');
  });

  it('should call the dependency.logVersionMisMatch method for each resolved package path and flow dependencies', async () => {
    path.resolveMonoRepoPackagePaths.mockReturnValue([
      '/foo/bar/package-a',
      '/foo/bar/package-b',
      '/foo/bar/package-c'
    ]);

    await alignFlowVersions();

    expect(dependency.logVersionMisMatch.mock.calls).toMatchSnapshot();
  });
});
