// @flow

const update = require('./updateVersion');

describe('updateVersion()', () => {
  let initialPkgConfig;

  beforeEach(() => {
    initialPkgConfig = {
      dependencies: {
        foo: '1.2.2'
      }
    };
  });

  it('should update version in correct path', () => {
    const updatedPkgConfig = update(initialPkgConfig, 'dependencies', 'foo', '1.4.0');

    expect(updatedPkgConfig).toMatchObject({
      dependencies: {
        foo: '1.4.0'
      }
    });
  });

  it('should skip when dependencyType is not available', () => {
    const updatedPkgConfig = update(initialPkgConfig, 'foo', 'foo', '1.4.0');
    expect(updatedPkgConfig).toMatchObject({
      dependencies: {
        foo: '1.2.2'
      }
    });
  });

  it('should skip when dependencyKey is not available', () => {
    const updatedPkgConfig = update(initialPkgConfig, 'dependencies', 'bar', '1.4.0');
    expect(updatedPkgConfig).toMatchObject({
      dependencies: {
        foo: '1.2.2'
      }
    });
  });
});
