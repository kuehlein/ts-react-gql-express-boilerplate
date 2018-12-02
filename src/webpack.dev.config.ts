import CleanWebpackPlugin from "clean-webpack-plugin";
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
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true,
    tsconfig: path.resolve(__dirname, ...rootDir, "tsconfig.client.json"), // only checks client
    tslint: path.resolve(__dirname, ...rootDir, "tslint.json"), // ???
    watch: path.resolve(__dirname, ...rootDir, "src", "client", "index.tsx")
  }),
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...rootDir, "public", "favicon.ico"),
    template: path.resolve(__dirname, ...rootDir, "public", "index.html")
  }),
  new HotModuleReplacementPlugin(),
  // ! vvv possibly unnecessary --- webpack-dev-middleware does everything in memory...
  new CleanWebpackPlugin(
    [path.resolve(__dirname, ...rootDir, "public", "dist", "*.*")],
    {
      allowExternal: true,
      root: path.resolve(__dirname, ...rootDir),
      verbose: true
    }
  )
  // new webpack.optimize.CommonsChunkPlugin('common.js') // ! ???
];

const hotMiddlewareScript: string = "webpack-hot-middleware/client"; // ?path=/__webpack_hmr&timeout=2000&reload=true";

const devConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-eval-source-map",
  entry: {
    client: ["react-hot-loader/patch", hotMiddlewareScript, include]
    // vendor: [
    //   // Required to support async/await
    //   "@babel/polyfill",
    //   hotMiddlewareScript
    // ]
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
        test: /\.(j|t)sx?$/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            cacheDirectory: true,
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "react-hot-loader/babel"
            ],
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } } // or whatever your project requires
              ],
              "@babel/preset-typescript",
              "@babel/preset-react"
            ]
          }
        }
      },
      // {
      //   exclude,
      //   loaders: "ts-loader",
      //   options: {
      //     configFile: path.resolve(__dirname, ...rootDir, "tsconfig.json"),
      //     happyPackMode: true,
      //     onlyCompileBundledFiles: true
      //   },
      //   test: /\.tsx?$/
      // },
      {
        enforce: "pre",
        exclude,
        include: path.resolve(__dirname, ".."), // ! ???
        loader: "source-map-loader",
        test: /\.js$/
      }
    ]
  },
  // node: {
  //   __dirname: false
  // },
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
    alias: {
      react: path.resolve(
        path.join(__dirname, ...rootDir, "./node_modules/react")
      )
      // "react-hot-loader": path.resolve(path.join(__dirname, "./../../"))
    },
    extensions: [".js", ".ts", ".tsx", "*"]
  },
  target: "web"
};

export default devConfig;

/*

REMOVE:

*ts-loader

OR

*babel-loader
*@babel/core
*@babel/preset-env
*@babel/plugin-proposal-decorators
*@babel/plugin-proposal-class-properties
*@babel/preset-typescript
*@babel/preset-react
*@babel/polyfill

*/
