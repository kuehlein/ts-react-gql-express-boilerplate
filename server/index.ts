// import passport from "passport";
import path from "path";

// import User from "./db/models/user";
import Server from "./server";

const app = new Server();

// * path to root directory from compiled typescript
if (process.env.NODE_ENV !== "production") {
  // tslint:disable-next-line
  require(path.resolve(__dirname, "..", "..", "secrets.js"));
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

app.createApp();

export default app;
