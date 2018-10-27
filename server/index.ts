/**
 * ! This module is an entry point !
 *   * Modify the webpack.config + package.json to make adjustments
 *   * to the locations of the entrypoints in this project.
 *
 *   * Be careful when modifying this module.
 */

// import passport from "passport";
import path from "path";

// import User from "./db/models/user";
import Server from "./server";

const app = new Server();

// * path to root directory from compiled typescript
if (process.env.NODE_ENV !== "production") {
  // tslint:disable-next-line
  require(path.resolve(__dirname, "..", "..", "..", "..", "secrets.js"));
}

// passport registration
// passport.serializeUser((user: User, done): void => done(null, user.id));
// passport.deserializeUser(
//   async (id: string, done): Promise<void> => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   }
// );

// This evaluates as true when this file is run directly from the command line,
// It will evaluate false when this module is required by another module - (eg. tests)
require.main === module ? app.createAppDev() : app.createAppProd();

export default app;
