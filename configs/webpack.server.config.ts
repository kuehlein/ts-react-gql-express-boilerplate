import CleanWebpackPlugin from "clean-webpack-plugin";
import path from "path";
import webpackMerge from "webpack-merge";

import baseConfig from "./webpack.base.config";

const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=4000&reload=true";

// relative path to public directory
const rootDir = path.extname(module.id) === ".ts" ? [".."] : ["..", ".."];

const serverEntry = path.resolve(__dirname, ...rootDir, "server", "index.ts");

// development plugins
const plugins = [
  new CleanWebpackPlugin(
    [
      path.resolve(__dirname, ...rootDir, "public", "dist", "*.*"),
      path.resolve(__dirname, ...rootDir, "ts-sourcemap", "*.*")
    ],
    {
      allowExternal: true,
      root: __dirname,
      verbose: true
    }
  )
];

const serverConfig = webpackMerge(baseConfig(serverEntry, plugins), {
  entry: {
    server: [/* hotMiddlewareScript, */ serverEntry]
  },
  mode: "development",
  target: "node"
});

export default serverConfig;
