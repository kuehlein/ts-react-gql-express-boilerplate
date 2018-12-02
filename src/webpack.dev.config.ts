import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

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
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...rootDir, "public", "favicon.ico"),
    template: path.resolve(__dirname, ...rootDir, "public", "index.html")
  }),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    tsconfig: path.resolve(__dirname, ...rootDir, "tsconfig.client.json"), // only checks client
    watch: path.resolve(__dirname, ...rootDir, "src", "client", "index.tsx")
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
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        exclude,
        loaders: "ts-loader",
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

/*

get watch-server working
dry up tsconfigs --- consolidate into 1?
optimize tsforkcheckerplugin
stop watch-server from repeating

 |
 V

gql tutorial + implement functionality here

*/
