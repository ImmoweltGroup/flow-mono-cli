// @flow

jest.mock('./logger.js');

const logger: any = require('./logger.js');
const fileUtils = require('./file.js');

describe('fileUtils.existsAsync()', () => {
  let accessAsync;

  beforeEach(() => {
    accessAsync = jest
      .spyOn(fileUtils._utils, 'accessAsync')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    accessAsync.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof fileUtils.existsAsync).toBe('function');
  });

  it('should return a boolean indicating if the filePath exists or not.', async () => {
    const exists = await fileUtils.existsAsync('/foo/bar/baz.js');

    expect(exists).toBe(true);
  });

  it('should return a falsy boolean if the fs.access method throw an error.', async () => {
    accessAsync.mockReturnValueOnce(
      Promise.reject(new Error('Does not exist'))
    );

    const exists = await fileUtils.existsAsync('/foo/bar/qux.js');

    expect(exists).toBe(false);
  });
});

describe('fileUtils.readJson()', () => {
  let readFileAsync;
  let fatal;

  beforeEach(() => {
    readFileAsync = jest
      .spyOn(fileUtils._utils, 'readFileAsync')
      .mockImplementation(jest.fn());
    fatal = jest.spyOn(logger, 'fatal').mockImplementation(jest.fn());
  });

  afterEach(() => {
    readFileAsync.mockRestore();
    fatal.mockRestore();
  });

  it('should be a function', () => {
    expect(typeof fileUtils.readJson).toBe('function');
  });

  it('should return the parsed contents of the given path.', async () => {
    readFileAsync.mockReturnValueOnce('{"foo": "bar"}');

    const json = await fileUtils.readJson('/foo/bar/baz.json');

    expect(json).toEqual({foo: 'bar'});
  });

  it('should call the fatal logger method if something went wrong during the parsing.', async () => {
    readFileAsync.mockReturnValueOnce('foo');

    await fileUtils.readJson('/foo/bar/baz.json');

    expect(fatal.mock.calls.length).toBe(1);
  });
});
