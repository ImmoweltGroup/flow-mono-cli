// @flow

jest.mock('./logger.js');

const logger: any = require('./logger.js');
const file = require('./file.js');

describe('fileUtils.existsAsync()', () => {
  let accessAsync;

  beforeEach(() => {
    accessAsync = jest.spyOn(file.utils, 'accessAsync').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof file.existsAsync).toBe('function');
  });

  it('should return a boolean indicating if the filePath exists or not.', async () => {
    const exists = await file.existsAsync('/foo/bar/baz.js');

    expect(exists).toBe(true);
  });

  it('should return a falsy boolean if the fs.access method throw an error.', async () => {
    accessAsync.mockReturnValueOnce(Promise.reject(new Error('Does not exist')));

    const exists = await file.existsAsync('/foo/bar/qux.js');

    expect(exists).toBe(false);
  });
});

describe('fileUtils.readJson()', () => {
  let readFileAsync;
  let error;

  beforeEach(() => {
    readFileAsync = jest.spyOn(file.utils, 'readFileAsync').mockImplementation(jest.fn());
    error = jest.spyOn(logger, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof file.readJson).toBe('function');
  });

  it('should return the parsed contents of the given path.', async () => {
    readFileAsync.mockReturnValueOnce('{"foo": "bar"}');

    const json = await file.readJson('/foo/bar/baz.json');

    expect(json).toEqual({foo: 'bar'});
  });

  it('should call the error logger method if something went wrong during the parsing.', async () => {
    readFileAsync.mockReturnValueOnce('foo');

    await file.readJson('/foo/bar/baz.json');

    expect(error.mock.calls.length).toBe(1);
  });
});

describe('fileUtils.writeFile()', () => {
  let writeFileAsync;

  beforeEach(() => {
    writeFileAsync = jest.spyOn(file.utils, 'writeFileAsync').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof file.readJson).toBe('function');
  });

  it('should call the writeFileAsync method and propagate all arguments to it.', async () => {
    await file.writeFile('/foo/bar/baz.json', {foo: 'bar'});

    expect(writeFileAsync.mock.calls[0]).toEqual(['/foo/bar/baz.json', {foo: 'bar'}, 'utf8']);
  });
});
