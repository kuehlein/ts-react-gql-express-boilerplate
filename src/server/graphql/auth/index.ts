import { Request } from "express";
import passport from "passport";
import { Strategy } from "passport-local";

import { ISignupAndLogin } from "../../../typings";
import { isEmail } from "../../../utils";
import { User } from "../../db";

// passport local strategy
passport.use(
  new Strategy(
    {
      passReqToCallback: true,
      usernameField: "emailOrUsername"
    },
    async (req, emailOrUsername, password, done) => {
      let key: "email" | "username";
      if (isEmail(emailOrUsername)) {
        key = "email";
        emailOrUsername = emailOrUsername.toLowerCase();
      } else {
        key = "username";
      }

      await User.findOne({ [key]: emailOrUsername })
        .then(user => {
          if (!user) {
            return done(null, false, { message: `Incorrect ${key}.` });
          }
          if (!user.isValidPassword(password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        })
        .catch(err => {
          console.log("we are here???", JSON.stringify(err, null, 2));
          return done(err);
        });
    }
  )
);

/**
 * Creates a new user account and logs them in using `req.login`. If the provided email is already in use
 * or no email or password is provided, an error will be thrown.
 */
export const signup = async (
  req: Request,
  user: ISignupAndLogin
) /* : Promise<User | void> */ => {
  if (!user.email || !user.username || !user.password) {
    throw new Error("You must provide an email and password.");
  }

  const createdUser = new User();
  createdUser.email = user.email;
  createdUser.password = user.password;
  createdUser.username = user.username;

  return createdUser.save().then((savedUser: User) /* : Promise<User> */ => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "local",
        (err: any, serializedUser: User, info: any) => {
          // if (err) throw new Error(err);
          if (err) reject(err);
          // return req.login(serializedUser, (err: any) => {

          req.login(serializedUser, (err: any) => {
            if (err) reject(err);
            resolve(serializedUser);
          });
        }
      )(
        (() => {
          req.body.emailOrUsername = savedUser.username || savedUser.email;
          req.body.password = savedUser.password;
          return req;
        })()
      );
    })
      .then(userBoi => {
        console.log(req.session);
        return userBoi;
      })
      .catch(err =>
        console.log(
          "\u001b[91;1mFailed to create a new user [graphql/auth/index --- signup]:\u001b[0m",
          err
        )
      );
  });
};

/**
 * Logs in an existing user. Since GraphQL expects a promsie,
 * `async` is used. Also, `passport.authenticate` returns a function,
 * hence the strange syntax.
 */
export const login = async (
  email: User["email"],
  password: User["password"],
  username: User["username"],
  req: Request
) /* : Promise<User> */ => {};

/**
 * Logs out the currently logged in user, and destroys the session.
 */
export const logout = (req: Request): boolean => {
  const authd = req.isAuthenticated();
  console.log("req.isAuthenticated()---------", authd);
  console.log("req.user---(before logout)----", req.user);
  // if (authd) {
  console.log("hit");
  req.logout();
  req.session.destroy(err => {
    if (err) console.log("Session was not destroyed", err);
  });
  // }
  return authd;
};
