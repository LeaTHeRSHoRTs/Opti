/** @typedef {import("webpack").Configuration} WebpackConfig */

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/**
 * Config for each webpack collection
 * @param {string} keyParam 
 * @returns {WebpackConfig}
 */
const requireProject = (keyParam) => {
  let key = keyParam;
  let dir = "";
  if (keyParam === "opti") {
    dir = "Core";
  } else {
    dir = keyParam[0]?.toUpperCase() + keyParam.slice(1);
  }

  return {
    mode: "production",
    cache: {
      type: 'filesystem'
    },
    name: key,
    entry: path.resolve(__dirname, "src", dir, key + ".ts"),
    output: {
      filename: `${key}.js`,
      path: path.resolve(__dirname, "dist"),
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
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        "@*": false
      }
    },
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [
          { 
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            }
          },
        ],
        exclude: /node_modules/,
      }]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: "package/tsconfig.json"
        }
      })
    ],
  };
};

module.exports = [
  requireProject("opti")
];

module.exports.parallelism = 2;