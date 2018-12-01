import CleanWebpackPlugin from "clean-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
import webpackMerge from "webpack-merge";
import nodeExternals from "webpack-node-externals";

import baseConfig from "./webpack.base.config";

const hotMiddlewareScript: string =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=4000&reload=true";

// relative path to public directory
const rootDir = ["..", ".."];

const serverEntry = path.resolve(
  __dirname,
  ...rootDir,
  "src",
  "server",
  "index.ts"
);

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

const serverConfig: Configuration = webpackMerge(
  baseConfig(serverEntry, plugins),
  {
    entry: {
      server: [/* hotMiddlewareScript, */ serverEntry]
    },
    externals: [nodeExternals()],
    mode: "development",
    target: "node"
  }
);

export default serverConfig;
