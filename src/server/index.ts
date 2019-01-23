import path from "path";

import Server from "./server";

const app = new Server();

if (process.env.NODE_ENV !== "production") {
  // tslint:disable-next-line:no-var-requires
  require(path.resolve(__dirname, "..", "..", "secrets.js"));
}

// this evaluates to true when executed from the command line
require.main === module ? app.createAppDev() : app.createAppProd();

export default app;
