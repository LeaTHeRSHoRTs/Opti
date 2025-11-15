const config = require('./config.cjs');

/** @type {import('jest').Config} */
module.exports = {
  rootDir: "../tests",
  testEnvironment: "jsdom",
  passWithNoTests: true,
  collectCoverage: false,
  projects: [
    config.jest(),
    config.jest("Crafty", "../dist/crafty.js"),
    config.jest("Evented", "../dist/evented.js"),
    config.jest("Flow", "../dist/flow.js"),
    config.jest("Query", "../dist/query.js"),
    config.jest("Requests", "../dist/requests.js")
  ]
};