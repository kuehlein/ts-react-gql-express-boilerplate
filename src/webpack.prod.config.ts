import path from "path";
import { Configuration, optimize } from "webpack";
import UglifyJsPlugin from "webpack-uglify-js-plugin";

// repeated config settings / paths
const rootDir = [".."];
const exclude = /node_modules/;
const include = path.resolve(
  __dirname,
  ...rootDir,
  "src",
  "client",
  "index.tsx"
);

// production plugins
const plugins = [new optimize.ModuleConcatenationPlugin()];
const minimizer = [
  new UglifyJsPlugin({
    parallel: { cache: false },
    uglifyOptions: {
      compress: {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        ie8: false,
        if_return: true,
        join_vars: true,
        keep_fnames: false,
        negate_iife: false,
        sequences: true,
        unused: true,
        warnings: false
      },
      mangle: {
        ie8: false
      },
      output: {
        comments: false
      }
    }
  })
];

const prodConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-source-map",
  entry: include,
  mode: "production",
  module: {
    rules: [
      {
        exclude,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        exclude,
        loader: "ts-loader",
        options: {
          configFile: path.resolve(
            __dirname,
            ...rootDir,
            "tsconfig.client.json"
          ),
          happyPackMode: true,
          onlyCompileBundledFiles: true
        },
        test: /\.tsx?$/
      },
      {
        enforce: "pre",
        exclude,
        loader: "source-map-loader",
        test: /\.js$/
      }
    ]
  },
  optimization: {
    minimizer
  },
  output: {
    filename: "[name].[hash].js"
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default prodConfig;
