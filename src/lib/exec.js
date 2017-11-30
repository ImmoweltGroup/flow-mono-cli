// @flow

const exec = require('execa');
const config = require('./config.js');

const execUtils = {
  async: exec,
  asyncWithRetries: async (...args: Array<mixed>) => {
    const {flowTypedCommandExecRetries} = await config.resolveAndReadConfig();
    let retries = flowTypedCommandExecRetries;
    let succeeded = false;

    while (retries-- > 0 && !succeeded) {
      try {
        await execUtils.async(...args);
        succeeded = true;
      } catch (e) {
        if (retries === 0) {
          throw e;
        }
      }
    }
  }
};

module.exports = execUtils;
