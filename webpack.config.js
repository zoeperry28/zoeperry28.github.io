const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: './src/page.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '.'
  },
  experiments:{
    topLevelAwait: true
  },
  mode: 'development',
  target: 'web', // set target to web instead of node
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    port: 8080,
    open: true,
    hot: true
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      console: require.resolve("console-browserify"),
      constants: require.resolve("constants-browserify"),
      crypto: require.resolve("crypto-browserify"),
      domain: require.resolve("domain-browser"),
      events: require.resolve("events/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      process: require.resolve("process/browser"),
      punycode: require.resolve("punycode/"),
      querystring: require.resolve("querystring-es3/"),
      stream: require.resolve("stream-browserify"),
      string_decoder: require.resolve("string_decoder/"),
      sys: require.resolve("util/"),
      timers: require.resolve("timers-browserify"),
      tty: require.resolve("tty-browserify"),
      url: require.resolve("url/"),
      util: require.resolve("util/")
    }
  },
  externals: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /papaparse/,
        loader: 'umd-compat-loader',
      }
    ]
  }
};
