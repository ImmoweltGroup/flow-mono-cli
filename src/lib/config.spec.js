// @flow

const config = require('./config.js');

describe('config.resolveAndReadConfig()', () => {
  let search;

  beforeEach(() => {
    search = jest.fn();
    jest.spyOn(config._utils, 'cosmiconfig').mockImplementation(
      jest.fn(() => ({
        search
      }))
    );
  });

  afterEach(() => {
    // $FlowFixMe: Ignore errors since the jest type-def is out of date.
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof config.resolveAndReadConfig).toBe('function');
  });

  it('should call the "find-config-up" package and return the resolved config', async () => {
    search.mockReturnValue({config: {foo: 'bar'}});

    const cfg = await config.resolveAndReadConfig();

    expect(cfg).toMatchSnapshot();
  });
});
