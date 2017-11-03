// @flow

const logger = require('./logger.js');

describe('logger', () => {
  it('should export an object', () => {
    expect(typeof logger).toBe('object');
  });
});
