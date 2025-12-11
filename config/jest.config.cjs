const { resolve } = require("path");

/** @type {import('jest').Config} */
module.exports = {
  rootDir: resolve(__dirname, ".."),  // root folder containing all submodules
  testEnvironment: "jsdom",
  preset: "ts-jest",
  passWithNoTests: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/_*.*",
    "Store/*.ts"
  ],
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