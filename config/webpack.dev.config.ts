import CleanWebpackPlugin from "clean-webpack-plugin";
// import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

// ! try to run ts files without emitting them

// root directory relative to compiled `.js` webpack.config
const rootDir = ["..", "..", "..", ".."];
const distDir = ["..", ".."];

// repeated settings for config
const exclude = /node_modules/;
// const include = path.resolve(__dirname, "..", "client", "index.js");
const tsconfig = path.resolve(
  __dirname,
  ...rootDir,
  "config",
  "tsconfig.client.json"
);

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

const entry =
  path.extname(module.id) === ".ts"
    ? path.resolve(__dirname, "client", "index.tsc")
    : path.resolve(__dirname, ...rootDir, "client", "index.tsx");

// script for webpack-hot-middleware
const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

const webpackDevConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "source-map", // "cheap-module-eval-source-map",
  entry: {
    app: entry, // [hotMiddlewareScript], // ? somehow include entry...
    vendor: [
      "react",
      "react-dom",
      // "react-router" ???
      hotMiddlewareScript
    ]
  },
  // externals: {
  //   react, react-dom, react-router-dom
  // },
  mode: "development",
  module: {
    rules: [
      {
        exclude,
        // include,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        exclude,
        include: entry,
        loader: "ts-loader",
        options: {
          configFile: tsconfig,
          // happyPackMode: true,
          // onlyCompileBundledFiles: true, // possibly redundant
          transpileOnly: true
        },
        test: /\.tsx?$/
      },
      {
        enforce: "pre",
        exclude,
        // include,
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
    path: path.join(__dirname, ...distDir)
  },
  plugins,
  resolve: {
    alias: {
      react: path.resolve(
        path.join(__dirname, ...rootDir, "node_modules", "react")
      ),
      "react-hot-loader": path.resolve(
        path.join(__dirname, ...rootDir, "node_modules", "react-hot-loader")
      )
      // "react-router-dom": path.resolve(
      //   path.join(__dirname, ...rootDir, "node_modules", "react-router-dom")
      // )
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", "*"]
  },
  target: "web" // node
};

export default webpackDevConfig;
