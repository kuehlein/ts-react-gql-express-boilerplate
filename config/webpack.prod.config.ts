import path from "path";
import { Configuration, optimize } from "webpack";
import UglifyJsPlugin from "webpack-uglify-js-plugin";

// root directory relative to compiled `.js` webpack.config
const rootDir = ["..", "..", "..", ".."];
const distDir = ["..", ".."];

// repeated settings for config
const exclude = /node_modules/;
const include =
  path.extname(module.id) === ".ts"
    ? path.resolve(__dirname, "client", "index.tsx")
    : path.resolve(__dirname, ...rootDir, "client", "index.tsx");
const tsconfig = path.resolve(
  __dirname,
  ...rootDir,
  "config",
  "tsconfig.prod.json"
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

const webpackProdConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-source-map",
  entry: include,
  mode: "production",
  module: {
    rules: [
      {
        exclude,
        include,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        exclude,
        loader: "ts-loader",
        options: {
          configFile: tsconfig,
          happyPackMode: true
        },
        test: /\.tsx?$/
      },
      {
        enforce: "pre",
        exclude,
        include,
        loader: "source-map-loader",
        test: /\.js$/
      }
    ]
  },
  optimization: {
    minimizer
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, ...distDir)
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default webpackProdConfig;
