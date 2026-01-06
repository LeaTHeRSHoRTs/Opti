const { resolve } = require("path");

/** @type {import('jest').Config} */
module.exports = {
  rootDir: resolve(__dirname, ".."),  // root folder containing all submodules
  testEnvironment: "jsdom",
  preset: "ts-jest",
  passWithNoTests: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ["./config/jest.functions.js"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/_*.*",
    "Store/*.ts"
  ],
  moduleNameMapper: {
    '^opti$': '<rootDir>/src/opti.ts',
    '^opti/crafty$': '<rootDir>/src/Crafty/crafty.ts',
    '^opti/unsync$': '<rootDir>/src/Unsync/unsync.ts',
    '^opti/query$': '<rootDir>/src/Query/query.ts',
    '^opti/flow$': '<rootDir>/src/Flow/flow.ts',
    '^opti/requests$': '<rootDir>/src/Requests/requests.ts'
  },
  coveragePathIgnorePatterns: [
    '/coverage/',
    '/node_modules/'
  ],
  moduleFileExtensions: ['ts', 'js'],
  testRegex: '\\.test\\.(ts|js)$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  }
};