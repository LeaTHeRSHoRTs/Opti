/** @typedef {import('jest').Config} JestConfig */
/** @typedef {import("webpack").Configuration} WebpackConfig */
/** @typedef {import("ts-jest").ConfigSet} TSJestConfig */

const path = require('path');
const url = require('url');

/**
 * Config for each jest enviroment
 * @param {string} dir 
 * @param {string|null} setup 
 * @returns {JestConfig}
 */
const jest = (env = "root", setup = null) => {
  return {
    displayName: env,
    rootDir: path.resolve(__dirname, "../tests", env === "root" ? "" : env),
    testEnvironment: "jsdom",
    setupFiles: [
      path.resolve(__dirname, "jest.setup.cjs")
    ].filter(Boolean),
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js'],
    testRegex: '\\.test\\.(ts|js)$',
    transform: {
      '^.+\\.ts$': ['ts-jest', {
        tsconfig: "./tsconfig.json"
      }],
    },
    globals: {
      JEST_SETUP_FILE: setup
    }
  };
};

/**
 * Config for each webpack collection
 * @param {string} keyParam 
 * @returns {WebpackConfig}
 */
const webpack = (keyParam) => {
  let key = keyParam;
  let dir = "";
  if (keyParam === "opti") {
    key = "opti";
  } else {
    dir = keyParam[0].toUpperCase() + keyParam.slice(1);
  }

  return {
    mode: "production",
    name: key,
    entry: path.resolve(__dirname, "..", "src", dir, key + ".ts"),
    output: {
      filename: `${key}.js`,
      path: path.resolve(__dirname, "..", "dist"),
      library: {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        type: "umd",
        export: "default"
      },
      globalObject: "globalThis"
    },
    optimization: {
      minimize: false,
      concatenateModules: true
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: false
        }
      }]
    }
  };
};

module.exports = {
  jest, webpack
};