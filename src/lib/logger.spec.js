// @flow

const logger = require('./logger.js');

describe('logger', () => {
  it('should export essential log functions', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.success).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
