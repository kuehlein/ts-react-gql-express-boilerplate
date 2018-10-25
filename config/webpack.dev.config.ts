import CleanWebpackPlugin from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

// ! noEmit: true --- add to tsconfig.main.json for babel typescript...?

// root directory relative to compiled `.js` webpack.config
const rootDir = ["..", "..", "..", ".."];
const distDir = ["..", ".."];

// repeated settings for config
const exclude = /node_modules/;
const include = [
  path.resolve(__dirname, "..", "client", "index.js"),
  path.resolve(__dirname, "..", "server", "index.js")
];
const tsconfig = path.resolve(
  __dirname,
  ...rootDir,
  "config",
  "tsconfig.client.json"
);

// development plugins
const plugins: HtmlWebpackPlugin[] = [
  new HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "..", "..", "..", "index.html")
  }),
  new ForkTsCheckerWebpackPlugin({
    tsconfig,
    tslint: path.resolve(__dirname, ...rootDir, "tslint.json"),
    watch: include
  }),
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
    app: [
      include[0], // client entry
      hotMiddlewareScript
    ],
    vendor: [
      include[1], // server entry
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
        include,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        // ! does babel need to handle jsx???
        exclude,
        include,
        loader: "ts-loader",
        options: {
          // `.json` filetype not compiled into `dist/`
          configFile: tsconfig,
          // happyPackMode: true,
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
  target: "node",
  watchOptions: {
    ignored: exclude,
    poll: 1000
  }
};

export default webpackDevConfig;

/*


typescript compiler and babel do the same thing...?
  *can i just use tsc to target es2015?
      * in production, target es6, tree shake, then es2015.
      * in dev, target es2015
- does ts-loader just use tsc? or babel.....
    -do i target es2015 in dev, and use ts-loader



IF I CANT DO WITH TSC....


___babel custom config___

babel goes through each file:

  * tsc <that.file>
        |
        V
  * babel transpile to es2015


        test: /\.(t|j)sx?$/

*/
