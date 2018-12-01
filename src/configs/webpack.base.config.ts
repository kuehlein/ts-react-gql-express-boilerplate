import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

// relative path to public directory
const rootDir = ["..", ".."];

// repeated settings for config
const exclude = /node_modules/;

// development plugins
const plugins = [
  new HotModuleReplacementPlugin(),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    tsconfig: path.resolve(__dirname, ...rootDir, "tsconfig.json"), // ???
    tslint: path.resolve(__dirname, ...rootDir, "tslint.json"),
    watch: path.resolve(__dirname, ...rootDir, "src", "client", "index.tsx") // ???
  })
  // new webpack.optimize.CommonsChunkPlugin('common.js') // ! ???
];

type baseConfig = (file: string, extraPlugins: any[]) => Configuration;

const baseConfig: baseConfig = (file, extraPlugins) => ({
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        exclude,
        include: file,
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
            "configs",
            "tsconfig.json"
          ),
          happyPackMode: true,
          onlyCompileBundledFiles: true
        },
        test: /\.tsx?$/
      },
      {
        enforce: "pre",
        exclude,
        include: path.resolve(__dirname, ".."),
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
  plugins: [...plugins, ...extraPlugins],
  resolve: {
    extensions: [".js", ".ts", ".tsx", "*"]
  }
});

export default baseConfig;
