import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";

// ? webpack-dev/hot-middleware needed that line in tsconfig.client.json before...
// "allowJs": true,

// root directory relative to compiled `.js` webpack.config
const rootDir = ["..", "..", "..", ".."];
const distDir = ["..", ".."];

// repeated settings for config
const exclude = /node_modules/;
const include = [
  path.resolve(__dirname, "..", "client", "src", `index.js`),
  path.resolve(__dirname, "..", "server", "index.js")
];
const plugins: HtmlWebpackPlugin[] = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "..", "..", "..", "index.html")
  }),
  new HotModuleReplacementPlugin(),
  new CleanWebpackPlugin([path.resolve(__dirname, ...distDir, "*.*")], {
    allowExternal: true,
    root: __dirname,
    verbose: true
  })
];

const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

const webpackDevConfig: Configuration = {
  context: path.resolve(__dirname, ...rootDir),
  devtool: "cheap-module-eval-source-map",
  entry: {
    app: [
      include[0], // client entry
      // "@babel/polyfill",
      hotMiddlewareScript
    ],
    vendor: [
      include[1], // server entry
      "react",
      "react-dom",
      // "@babel/polyfill",
      hotMiddlewareScript
    ]
  },
  // externals: {
  //   // react, react-dom, react-router
  // },
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
      // {
      //   loader: path.join(__dirname, "my-custom-loader.js") // might need to do this...
      // },
      {
        exclude,
        include,
        loader: "babel-loader",
        options: {
          babelrc: true,
          cacheDirectory: true
          // configFileName: path.resolve(
          //   // ! ???
          //   __dirname,
          //   ...rootDir,
          //   "config",
          //   "tsconfig.client.json"
          // )
          // plugins: [
          //   ["@babel/plugin-proposal-class-properties", { loose: true }],
          //   ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
          //   ["@babel/plugin-proposal-decorators", { legacy: true }],
          //   [
          //     "react-hot-loader/babel"
          //     //   {
          //     //     configFileName: path.resolve(
          //     //       __dirname,
          //     //       ...rootDir,
          //     //       "config",
          //     //       "tsconfig.client.json"
          //     //     )
          //     //   }
          //   ]
          // ],
          // presets: [
          //   ["@babel/preset-env", { targets: { browsers: "last 2 versions" } }],
          //   [
          //     "@babel/preset-typescript"
          //     // {
          //     //   configFileName: path.resolve(
          //     //     __dirname,
          //     //     ...rootDir,
          //     //     "config",
          //     //     "tsconfig.client.json"
          //     //   )
          //     // }
          //   ],
          //   "@babel/preset-react"
          // ]
        },
        test: /\.(j|t)sx?$/
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

this instucts babel on how to handle each file --- not all tsc then bundle :/

// Export from "./my-custom-loader.js" or whatever you want.
module.exports = require("babel-loader").custom(babel => {
  function myPlugin() {
    return {
      visitor: {},
    };
  }

  return {
    // Passed the loader options.
    customOptions({ opt1, opt2, ...loader }) {
      return {
        // Pull out any custom options that the loader might have.
        custom: { opt1, opt2 },

        // Pass the options back with the two custom options removed.
        loader,
      };
    },

    // Passed Babel's 'PartialConfig' object.
    config(cfg) {
      if (cfg.hasFilesystemConfig()) {
        // Use the normal config
        return cfg.options;
      }

      return {
        ...cfg.options,
        plugins: [
          ...(cfg.options.plugins || []),

          // Include a custom plugin in the options.
          myPlugin,
        ],
      };
    },

    result(result) {
      return {
        ...result,
        code: result.code + "\n// Generated by some custom loader",
      };
    },
  };
});

*/
