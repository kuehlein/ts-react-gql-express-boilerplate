import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

// repeated config settings / paths
const rootDir = [".."];
const include = path.resolve(
  __dirname,
  ...rootDir,
  "src",
  "client",
  "index.tsx"
);
const exclude = /node_modules/;

// development plugins
const plugins = [
  new HotModuleReplacementPlugin(),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    tsconfig: path.resolve(__dirname, ...rootDir, "tsconfig.json"), // ???
    tslint: path.resolve(__dirname, ...rootDir, "tslint.json"),
    watch: path.resolve(__dirname, ...rootDir, "src", "client", "index.tsx") // ???
  }),
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...rootDir, "public", "favicon.ico"),
    template: path.resolve(__dirname, ...rootDir, "public", "index.html")
  })
  // new webpack.optimize.CommonsChunkPlugin('common.js') // ! ???
];

const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=4000&reload=true";

const devConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-eval-source-map",
  entry: {
    client: ["react-hot-loader/patch", hotMiddlewareScript, include]
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
        loader: "ts-loader",
        options: {
          configFile: path.resolve(__dirname, ...rootDir, "tsconfig.json"),
          happyPackMode: true,
          onlyCompileBundledFiles: true
        },
        test: /\.tsx?$/
      },
      {
        enforce: "pre",
        exclude,
        include: path.resolve(__dirname, ".."), // ! ???
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
    path: path.resolve(__dirname, ...rootDir, "public", "dist"),
    publicPath: "/"
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default devConfig;
