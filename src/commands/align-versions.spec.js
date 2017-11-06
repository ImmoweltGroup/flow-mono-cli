// @flow

jest.mock('./../lib/paths.js');
jest.mock('./../lib/dependency.js');
jest.mock('./../lib/logger.js');

const inquirer = require('inquirer');
const path: any = require('./../lib/paths.js');
const dependency: any = require('./../lib/dependency.js');

const alignFlowVersions = require('./align-versions.js');

describe('align-versions', () => {
  let prompt;

  beforeEach(() => {
    prompt = jest.spyOn(inquirer, 'prompt').mockImplementation(jest.fn());
  });

  afterEach(() => {
    prompt.mockRestore();
  });

  it('should export an function', () => {
    expect(typeof alignFlowVersions).toBe('function');
  });

  it('should call the dependency.logVersionMisMatch method for each resolved package path and flow dependencies', async () => {
    path.resolveMonoRepoPackagePaths.mockReturnValue([
      '/foo/packages/package-a',
      '/foo/packages/package-b',
      '/foo/packages/package-c'
    ]);
    path.resolveMonoRepoRootPath.mockReturnValueOnce('/foo');
    dependency.hasRootVersionMisMatch
      .mockReturnValueOnce(
        Promise.resolve({
          hasMisMatch: true,
          rootVersion: '1.2.0',
          packageVersion: '1.0.0'
        })
      )
      .mockReturnValueOnce(
        Promise.resolve({
          hasMisMatch: true,
          rootVersion: '1.3.0',
          packageVersion: '1.0.0'
        })
      )
      .mockReturnValue(
        Promise.resolve({
          hasMisMatch: false,
          rootVersion: '1.2.0',
          packageVersion: '1.2.0'
        })
      );
    prompt
      .mockReturnValueOnce({shouldUpdateDependency: true})
      .mockReturnValue({shouldUpdateDependency: false});

    await alignFlowVersions();

    expect(dependency.updateDependency.mock.calls).toMatchSnapshot();
  });
});
