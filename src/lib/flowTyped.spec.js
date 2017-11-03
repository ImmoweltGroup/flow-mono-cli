// @flow

jest.mock('./logger.js');
jest.mock('./dependency.js');
jest.mock('./exec.js');

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
  afterEach(() => {
    dependency.mergeDependenciesIntoMap.mockReset();
    dependency.readPackageJson.mockReset();
    exec.async.mockRestore();
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
    expect(exec.async.mock.calls[0]).toEqual([
      'flow-typed',
      ['create-stub', 'foo@1.2.0', 'bar@1.0.0', 'baz@3.20.1'],
      {cwd: '/foo/bar', localDir: '/foo/bar', preferLocal: true}
    ]);
  });
});
