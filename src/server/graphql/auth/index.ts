import { Request } from "express";
import passport from "passport";
import { Strategy } from "passport-local";

import { ISignupAndLogin } from "../../../types";
import { User } from "../../db";
import { addUserToReq, checkEmailOrUsername } from "./utils";

// ! https://www.apollographql.com/docs/apollo-server/v2/features/authentication.html

// passport local strategy
passport.use(
  new Strategy(async (emailOrUsername, password, done) => {
    const key = checkEmailOrUsername(emailOrUsername);
    emailOrUsername =
      key === "email" ? emailOrUsername.toLowerCase() : emailOrUsername;

    await User.findOne({ [key]: emailOrUsername })
      .then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect username/email." });
        }
        if (!user.isValidPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      })
      .catch(err => done(err));
  })
);

/**
 * Creates a new user account and logs them in using `req.login`. If the provided email is already in use
 * or no email or password is provided, an error will be thrown.
 */
export const signup = async (
  req: Request,
  user: ISignupAndLogin
): Promise<User> => {
  if (!user.email || !user.username || !user.password) {
    throw new Error("You must provide an email, username and password.");
  }

  const createdUser = new User();
  createdUser.email = user.email;
  createdUser.password = user.password;
  createdUser.username = user.username;

  return (
    createdUser
      .save()
      // * use original user arg
      .then(newUser => login(req, newUser, user.password))
      .catch(err => err.message)
  );
};

/**
 * Logs in an existing user. Since GraphQL expects a promsie,
 * `async` is used. Also, `passport.authenticate` returns a function,
 * hence the strange syntax.
 */
export const login = async (
  req: Request,
  user: ISignupAndLogin,
  password?: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      (err: any, authenticatedUser: User, anotherThing) => {
        if (err) reject(err);

        req.login(authenticatedUser, (err: any) => {
          if (err) reject(err);
          resolve(authenticatedUser);
        });
      }
    )(addUserToReq(req, user, password));
  });
};

/**
 * Logs out the currently logged in user, and destroys the session.
 */
export const logout = (req: Request): User => {
  const user = req.user;

  req.logout();
  req.session.destroy(err => {
    if (err) console.log("Session was not destroyed", err);
  });

  return user;
};
