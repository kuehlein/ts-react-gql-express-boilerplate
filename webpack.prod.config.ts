import path from "path";
import { Configuration, optimize } from "webpack";
const { ModuleConcatenationPlugin } = optimize;
import UglifyJsPlugin from "webpack-uglify-js-plugin";

// root directory relative to compiled `.js` webpack.config
const rootDir = ["..", "..", ".."];

// repeated settings for config
const exclude = /node_modules/;
const include = path.join(__dirname, "client", "src", `index.js`);
const plugins = [new ModuleConcatenationPlugin()];
const minimizer = [
  new UglifyJsPlugin({
    parallel: { cache: false, workers: 2 },
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
  context: __dirname,
  devtool: "cheap-module-source-map",
  entry: {
    app: [include, "webpack-hot-middleware/client"],
    vendor: [
      "react",
      "react-dom",
      "@babel/polyfill",
      "webpack-hot-middleware/client"
    ]
  },
  externals: {
    // react, react-dom, react-router
  },
  mode: "production",
  module: {
    rules: [
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
            [
              "@babel/preset-typescript",
              {
                configFileName: `${rootDir.join("/")}/tsconfig.json`
              }
            ],
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
    minimizer,
    nodeEnv: "production"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "public", "dist")
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
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", "*"]
  }
};

export default webpackProdConfig;
