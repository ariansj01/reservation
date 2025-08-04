const timeout = require('connect-timeout');

const timeoutMiddleware = timeout('15s');

module.exports = timeoutMiddleware;


