// @flow

//
// The package `log-fancy` gets served with it's own typings.
//
// The typings also include references to other packages, which we create stubs for since we don't want symlinks for
// in-direct dependencies on a per package basis.
//
const createLogger = require('log-fancy');
const logger = createLogger('@immowelt/search-ui');

module.exports = logger;
