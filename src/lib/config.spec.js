// @flow

jest.mock('./file.js');

const file: any = require('./file.js');
const config = require('./config.js');

describe('config.defaults', () => {
  it('should be a object', () => {
    expect(typeof config.defaults).toBe('object');
  });
});

describe('config.findPkgConfigUp()', () => {
  let findUp;

  beforeEach(() => {
    findUp = jest.spyOn(config._utils, 'findUp').mockImplementation(jest.fn());
  });

  afterEach(() => {
    findUp.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof config.findPkgConfigUp).toBe('function');
  });

  it('should resolve the contents of the package.json config which will be resolved up the tree', async () => {
    file.readJson
      .mockReturnValueOnce({})
      .mockReturnValueOnce({'flow-mono': {foo: 'bar'}});
    findUp
      .mockReturnValueOnce('/foo/bar/baz/package.json')
      .mockReturnValueOnce('/foo/bar/package.json');

    const contents = await config.findPkgConfigUp('/foo/bar/baz');

    expect(contents).toEqual({foo: 'bar'});
  });
});

describe('config.resolveAndReadConfig()', () => {
  let findPkgConfigUp;
  let findUp;

  beforeEach(() => {
    findPkgConfigUp = jest
      .spyOn(config, 'findPkgConfigUp')
      .mockImplementation(jest.fn());
    findUp = jest.spyOn(config._utils, 'findUp').mockImplementation(jest.fn());
  });

  afterEach(() => {
    findPkgConfigUp.mockRestore();
    findUp.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof config.resolveAndReadConfig).toBe('function');
  });

  it('should return the contents of the ".monoflowrc" if one was found up the filesystem tree', async () => {
    findUp.mockReturnValue('/foo/bar/baz/.flowmonorc');
    file.readJson.mockReturnValueOnce({someMonoRcConfig: true});

    const cfg = await config.resolveAndReadConfig('/foo/bar/baz/qux');

    expect(cfg).toMatchSnapshot();
  });

  it('should return the contents of the "package.json" with a mono-flow property if one was found up the filesystem tree', async () => {
    findUp.mockReturnValue(null);
    findPkgConfigUp.mockReturnValue({somePackageJsonConfig: true});

    const cfg = await config.resolveAndReadConfig('/foo/bar/baz');

    expect(cfg).toMatchSnapshot();
  });
});
