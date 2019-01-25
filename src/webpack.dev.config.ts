import ExtractCssChunks from "extract-css-chunks-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import FilterWarningsPlugin from "webpack-filter-warnings-plugin";

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

// development plugins
const plugins = [
  new HotModuleReplacementPlugin(),
  new ExtractCssChunks({
    chunkFilename: "[id].[hash].css",
    cssModules: true,
    filename: "[name].[hash].css",
    hot: true
  }),
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...rootDir, "public", "favicon.ico"),
    template: path.resolve(__dirname, ...rootDir, "public", "index.html")
  }),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    tsconfig: path.resolve(
      __dirname,
      ...rootDir,
      "configs",
      "tsconfig.client.json"
    ), // * only checks client
    watch: path.resolve(__dirname, ...rootDir, "src", "client", "index.tsx")
  }),
  new FilterWarningsPlugin({
    // * suppress warnings from unused drivers with typeorm
    exclude: [
      /mongodb/,
      /mssql/,
      /mysql/,
      /mysql2/,
      /oracledb/,
      /pg-native/,
      /pg-query-stream/,
      /redis/,
      /sqlite3/
    ]
  })
];

const devConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-eval-source-map",
  entry: {
    client: ["webpack-hot-middleware/client?&reload=true", include]
  },
  mode: "development",
  module: {
    rules: [
      {
        exclude,
        loader: "style-loader",
        test: /\.css$/
      },
      {
        exclude,
        loader: "css-loader",
        options: {
          modules: true
        },
        test: /\.css$/
      },
      // {
      //   exclude,
      //   loader: "graphql-tag/loader",
      //   test: /\.(gql)$/ ///\.(graphql|gql)$/
      // },
      {
        exclude,
        loaders: "ts-loader",
        options: {
          configFile: path.resolve(
            __dirname,
            ...rootDir,
            "configs",
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
    nodeEnv: "development"
  },
  output: {
    filename: "[name].[hash].bundle.js",
    publicPath: "/"
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default devConfig;
