const config = require('./config.cjs');

module.exports = [
  config.webpack("opti"),
  config.webpack("crafty"),
  config.webpack("query"),
  config.webpack("evented"),
  config.webpack("requests"),
  config.webpack("flow"),
];

module.exports.parallelism = 2;