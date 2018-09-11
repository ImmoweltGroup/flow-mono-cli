// @flow

jest.mock('./config.js');

const config: any = require('./config.js');
const exec = require('./exec.js');

describe('exec.async()', () => {
  it('should be a function', () => {
    expect(typeof exec.async).toBe('function');
  });
});

describe('exec.asyncWithRetries()', () => {
  let execAsync;

  beforeEach(() => {
    execAsync = jest.spyOn(exec, 'async').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof exec.asyncWithRetries).toBe('function');
  });

  it('should propagate all arguments to the exec.async function', async () => {
    config.resolveAndReadConfig.mockReturnValueOnce({
      flowTypedCommandExecRetries: 1
    });

    await exec.asyncWithRetries('foo', 'bar', 'baz');

    expect(execAsync).toHaveBeenCalledWith('foo', 'bar', 'baz');
  });

  it('should resolve the retries count from the config and retry the commands execution that many times if it had failed', async () => {
    config.resolveAndReadConfig.mockReturnValueOnce({
      flowTypedCommandExecRetries: 2
    });
    execAsync.mockImplementationOnce(() => Promise.reject(new Error('first failure')));

    await exec.asyncWithRetries();

    expect(execAsync).toHaveBeenCalledTimes(2);
  });

  it('should propagate the error if the command has failed on the last execution', () => {
    config.resolveAndReadConfig.mockReturnValueOnce({
      flowTypedCommandExecRetries: 2
    });
    execAsync
      .mockImplementationOnce(() => Promise.reject('first failure')) // eslint-disable-line prefer-promise-reject-errors
      .mockImplementationOnce(() => Promise.reject('second failure')); // eslint-disable-line prefer-promise-reject-errors

    expect(exec.asyncWithRetries()).rejects.toMatch('second failure');
  });
});
