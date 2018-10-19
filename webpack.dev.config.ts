import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

// ? webpack-dev/hot-middleware needed that line in tsconfig before...
// "allowJs": true,

// repeated settings for config
const exclude = /node_modules/;
const include = path.join(__dirname, "client", "src", `index.js`);
const plugins: HtmlWebpackPlugin[] = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "public", "index.html")
  }),
  new HotModuleReplacementPlugin(),
  new CleanWebpackPlugin([path.resolve(__dirname, "public", "dist/*.*")], {
    allowExternal: true,
    root: __dirname,
    verbose: true
  })
];

const webpackDevConfig: Configuration = {
  context: __dirname,
  devtool: "cheap-module-eval-source-map",
  entry: {
    app: [include, "webpack-hot-middleware/client"],
    vendor: ["react", "react-dom", "webpack-hot-middleware/client"]
  },
  externals: {
    // react, react-dom, react-router
  },
  mode: "development",
  module: {
    rules: [
      {
        enforce: "pre",
        exclude,
        include,
        loader: "source-map-loader",
        test: /\.js$/
      },
      {
        exclude,
        include,
        options: {
          babelrc: false,
          cacheDirectory: true,
          plugins: [
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            "react-hot-loader/babel"
          ],
          presets: [
            ["@babel/preset-env", { targets: { browsers: "last 2 versions" } }],
            "@babel/preset-typescript",
            "@babel/preset-react"
          ]
        },
        test: /\.(j|t)sx?$/,
        use: "babel-loader"
      },
      {
        exclude,
        include,
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  optimization: {
    nodeEnv: "development"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "public", "dist")
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", "*"]
  },
  target: "node",
  watchOptions: {
    ignored: exclude,
    poll: 1000
  }
};

export default webpackDevConfig;
