import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
import webpackMerge from "webpack-merge";

import baseConfig from "./webpack.base.config";

const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=4000&reload=true";

// relative path to public directory
const rootDir = ["..", ".."];

const clientEntry = path.resolve(__dirname, ...rootDir, "client", "index.tsx");

// development plugins
const plugins = [
  new HtmlWebpackPlugin({
    favicon: path.resolve(__dirname, ...rootDir, "public", "favicon.ico"),
    template: path.resolve(__dirname, ...rootDir, "public", "index.html")
  })
];

const clientConfig: Configuration = webpackMerge(
  baseConfig(clientEntry, plugins),
  {
    entry: {
      client: ["react-hot-loader/patch", hotMiddlewareScript, clientEntry]
    },
    mode: "development",
    target: "web"
  }
);

export default clientConfig;
