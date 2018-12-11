// import express from "express";
// import User from "../db/models/user";

// const router = express.Router();

// router.post("/login", async (req, res, next) => {
//   try {
//     const user = await User.findOne({ where: { email: req.body.email } });
//     if (!user) {
//       console.log("No such user found:", req.body.email);
//       res.status(401).send("Wrong username and/or password");
//     } else if (!user.correctPassword(req.body.password)) {
//       console.log("Incorrect password for user:", req.body.email);
//       res.status(401).send("Wrong username and/or password");
//     } else {
//       req.login(user, err => (err ? next(err) : res.json(user)));
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// router.post("/signup", async (req, res, next) => {
//   try {
//     const user = await User.create(req.body);
//     req.login(user, err => (err ? next(err) : res.json(user)));
//   } catch (err) {
//     if (err.name === "SequelizeUniqueConstraintError") {
//       res.status(401).send("User already exists");
//     } else {
//       next(err);
//     }
//   }
// });

// router.post("/logout", (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.redirect("/");
// });

// router.get("/me", (req, res) => {
//   res.json(req.user);
// });

// router.use("/google", require("./google"));

// module.exports = router;

/* ------------------------------------------------------------------- */
/* ------------------------------------------------------------------- */
/* ------------------------------------------------------------------- */

import passport from "passport";

import { User } from "../db";
import { throwIfError } from "../utils";

// Provides an identifying token (user's id) to be used in the user's session
passport.serializeUser((user: User, done) => done(null, user.id));

// Given a user's ID, return the user object. This object is placed on `req.user`.
passport.deserializeUser(async (id: User["id"], done) => {
  const user = await User.findOne(id);
  done(null, user);
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
// passport.use(
//   new LocalStrategy({ usernameField: "email" }, (
//     email: User["email"],
//     password: User["password"],
//     done // : (err: any, id?: {}) => void
//   ) =>
//     User.findOne({ email: email.toLowerCase() }, (err, user) => {
//       if (err) return done(err);
//       if (!user) return done(null, false, "Invalid Credentials");

//       user.comparePassword(password, (err, isMatch) => {
//         if (err) return done(err);
//         if (isMatch) return done(null, user);
//         return done(null, false, "Invalid credentials.");
//       });
//     })
//   )
// );

/**
 * Creates a new user account and logs them in using `req.login`. If the provided email is already in use
 * or no email or password is provided, an error will be thrown.
 */
export const signup = async (
  user: User,
  req: Express.Request
): Promise<void> => {
  if (!user.email || !user.password) {
    throw new Error("You must provide an email and password.");
  }
  const newUser = Object.assign(new User(), user);

  return await User.findOne({ email: user.email })
    .then(existingUser =>
      throwIfError(!!existingUser, "Email in use", newUser.save())
    )
    .then(async savedUser =>
      req.logIn(savedUser, err => throwIfError(err, err, savedUser))
    )
    .catch(err => console.log(err));
};

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
export const login = async ({ email, password, req }) =>
  // ! might need to be reworked...
  await passport.authenticate("local", (err, user) => {
    if (!user) throw new Error("Invalid Credentials");
    req.login(user, () => user)({ body: { email, password } });
  });
