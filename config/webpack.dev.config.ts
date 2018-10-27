import CleanWebpackPlugin from "clean-webpack-plugin";
// import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import {
  Configuration,
  HotModuleReplacementPlugin
  // NamedModulesPlugin
} from "webpack";

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
  "tsconfig.client.json"
);

// // prints more readable module names in the browser console on HMR updates
// new NamedModulesPlugin(),

// development plugins
const plugins = [
  new HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "..", "..", "..", "index.html")
  }),
  // new ForkTsCheckerWebpackPlugin({
  //   tsconfig,
  //   tslint: path.resolve(__dirname, ...rootDir, "tslint.json"),
  //   watch: include
  // }),
  new CleanWebpackPlugin([path.resolve(__dirname, ...distDir, "*.*")], {
    allowExternal: true,
    root: __dirname,
    verbose: true
  })
];

// script for webpack-hot-middleware
const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

const webpackDevConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-eval-source-map",
  entry: {
    app: ["react-hot-loader/patch", include, hotMiddlewareScript],
    vendor: ["react", "react-dom", hotMiddlewareScript]
  },
  externals: {
    // react, react-dom, react-router
  },
  mode: "development",
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
        include,
        loader: "ts-loader",
        options: {
          configFile: tsconfig,
          transpileOnly: true
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
    nodeEnv: "development"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, ...distDir),
    publicPath: path.join(__dirname, ...distDir, "static/")
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default webpackDevConfig;
