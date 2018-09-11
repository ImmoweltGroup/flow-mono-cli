// @flow

const debugLogger = require('debug-logger');

debugLogger.levels.info = {
  color: debugLogger.colors.blue,
  prefix: ' ',
  namespaceSuffix: ':info'
};

debugLogger.levels.success = {
  color: debugLogger.colors.green,
  prefix: ' ',
  namespaceSuffix: ':success'
};

module.exports = debugLogger('flow-mono-cli');
