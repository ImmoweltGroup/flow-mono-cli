// @flow

jest.mock('./logger.js');
jest.mock('./dependency.js');
jest.mock('./exec.js');

const fs = require('fs');
const exec: any = require('./exec.js');
const dependency: any = require('./../lib/dependency.js');
const flowTypedUtils = require('./flowTyped.js');

describe('flowTypedUtils.parseArgs()', () => {
  it('should be a function', () => {
    expect(typeof flowTypedUtils.parseArgs).toBe('function');
  });

  it('should not fail when executed without arguments.', () => {
    expect(() => flowTypedUtils.parseArgs()).not.toThrow();
  });

  it('should return a list of arguments that can be propagated to flowTyped.', () => {
    const args = flowTypedUtils.parseArgs({
      foo: 'bar',
      overwrite: '',
      ignoreDeps: 'peer'
    });

    expect(args).toEqual(['--overwrite', '--ignoreDeps=peer']);
  });
});

describe('flowTypedUtils.createStubsForInDirectDependencies()', () => {
  let existsSync;
  let writeFileSync;
  let unlinkSync;

  beforeEach(() => {
    existsSync = jest.spyOn(fs, 'existsSync').mockImplementation(jest.fn());
    writeFileSync = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(jest.fn());
    unlinkSync = jest.spyOn(fs, 'unlinkSync').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof flowTypedUtils.createStubsForInDirectDependencies).toBe(
      'function'
    );
  });

  it('should parse the dependencies package json and execute a "flow-type create-stub" command for all resolved in-idrect dependencies.', async () => {
    dependency.mergeDependenciesIntoMap.mockReturnValueOnce({
      foo: '1.2.0',
      bar: '1.0.0',
      baz: '3.20.1'
    });

    await flowTypedUtils.createStubsForInDirectDependencies(
      '/foo/bar',
      'some-package'
    );

    expect(dependency.readPackageJson.mock.calls).toEqual([
      ['/foo/bar/node_modules/some-package']
    ]);
    expect(exec.asyncWithRetries.mock.calls[0]).toEqual([
      'flow-typed',
      ['create-stub', 'foo@1.2.0', 'bar@1.0.0', 'baz@3.20.1'],
      {cwd: '/foo/bar', localDir: '/foo/bar', preferLocal: true}
    ]);
  });

  it('should create a .flowconfig file if none exists in the given cwd since flow-typed would crash otherwise.', async () => {
    dependency.mergeDependenciesIntoMap.mockReturnValueOnce({
      foo: '1.2.0',
      bar: '1.0.0',
      baz: '3.20.1'
    });
    existsSync.mockReturnValue(false);

    await flowTypedUtils.createStubsForInDirectDependencies(
      '/foo/bar',
      'some-package'
    );

    expect(writeFileSync.mock.calls).toEqual([
      [
        '/foo/bar/.flowconfig',
        '# Intermediate .flowconfig file created by `flow-mono-cli'
      ]
    ]);
    expect(unlinkSync.mock.calls).toEqual([['/foo/bar/.flowconfig']]);
  });
});
