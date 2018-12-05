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

import mongoose from "mongoose";
import passport from "passport";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

import { throwIfError } from "../utils";
const User = mongoose.model("user");

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => done(null, user.id));

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser((id, done) =>
  User.findById(id, (err, user) => done(err, user))
);

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) =>
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, "Invalid Credentials");

      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) return done(null, user);
        return done(null, false, "Invalid credentials.");
      });
    })
  )
);

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
export const signup = ({ email, password, req }) => {
  if (!email || !password) {
    throw new Error("You must provide an email and password.");
  }
  const user = new User({ email, password });

  return User.findOne({ email })
    .then(existingUser =>
      throwIfError(existingUser, "Email in use", user.save())
    )
    .then(async user => req.logIn(user, err => throwIfError(err, err, user)))
    .catch(err => console.log(err));
};

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
export const login = async ({ email, password, req }) =>
  passport.authenticate("local", (err, user) => {
    if (!user) throw new Error("Invalid Credentials");
    req.login(user, () => user)({ body: { email, password } });
  });

// Promise.resolve((resolve, reject) => {
//   const authenticatedUser = passport.authenticate("local", (err, user) => {
//     if (!user) reject("Invalid credentials.");
//     req.login(user, () => resolve(user));
//   });

//   return authenticatedUser({ body: { email, password } });
// });
