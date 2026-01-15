#!/usr/bin/env node
//@ts-check
const { resolve, basename } = require('path');

const trueRoot = resolve(__dirname, "tests");
const clientRoot = resolve(trueRoot, "modules");
const commandRoot = resolve(trueRoot, "command");

const baseConfig = (/** @type {string} */ root) => ({
  displayName: basename(root),
  rootDir: root,
  testEnvironment: "jsdom",
  preset: "ts-jest/presets/default-esm",
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ["../../jest.functions.js"],
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { 
      tsconfig: resolve(root, "tsconfig.json")
    }],
  },
  coveragePathIgnorePatterns: [
    '/coverage/',
    '/node_modules/'
  ],
});

/** @type {import('jest').Config} */
module.exports = {
  rootDir: trueRoot,
  projects: [
    {
      ...baseConfig(clientRoot),
      collectCoverageFrom: [
        "../../src/**/*.ts",
        "!../../src/**/*.d.ts",
        "!../../src/**/_*.*"
      ],
      moduleNameMapper: {
        '^opti$': '<rootDir>/../../src/modules/Core/opti.ts',
        '^opti/(.*)$': '<rootDir>/../../src/modules/$1'
      }
    },
    {
      ...baseConfig(commandRoot),
      collectCoverageFrom: [
        "../../cli/opti.ts"
      ],
      moduleNameMapper: {
        "^cli$": '<rootDir>/../../src/command/opti.ts'
      }
    },
  ]
};