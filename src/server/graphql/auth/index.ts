import { Request } from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import { getConnection } from "typeorm";

import { ISignupAndLogin } from "../../../typings";
import { User } from "../../db";
import { throwIfError } from "../../utils";

// ! put local strategy here???

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

  return createdUser
    .save()
    .then((savedUser: User) =>
      new Promise((resolve, reject) =>
        passport.authenticate(
          "local",
          // ! can i specify no redirect?
          (err: any, serializedUser: User, info: any) => {
            if (err) throw new Error(err);

            return req.login(serializedUser, (err: any) => {
              if (err) reject(err);
              return resolve(serializedUser);
            });
          }
        )(
          (() => {
            // req.body.emailOrUsername = savedUser.username || savedUser.email;
            req.body.username = savedUser.username;
            req.body.password = user.password;
            return req;
          })()
        )
      ).catch(err => console.log(err))
    )
    .catch(err =>
      console.log(
        "\u001b[91;1mFailed to create a new user [graphql/auth/index --- signup]:\u001b[0m",
        err
      )
    );
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
): Promise<User> => {
  return passport.authenticate("local", (err, user) => {
    if (err) throw new Error(err);
    if (!user) throw new Error("Invalid Credentials");

    // ? req.isAuthenticated()

    const searchParam = email ? email : username;

    // ! validate password?????

    req.login(user, async err => {
      if (err) throw new Error("something went wrong...");
      const retrievedUser = await getConnection()
        .getRepository(User)
        .createQueryBuilder("user")
        .where(`user.${searchParam} = :${searchParam}`, {
          [searchParam]: searchParam
        })
        .getOne();
      return await retrievedUser.id;
    });
  });
};

/**
 * Logs out the currently logged in user, and destroys the session.
 */
export const logout = (req: Request): boolean => {
  const authd = req.isAuthenticated();
  console.log("req.isAuthenticated()---------", authd);
  console.log("req.user---(before logout)----", req.user);
  if (authd) {
    console.log("hit");
    req.logout();
    req.session.destroy(err => {
      if (err) console.log("Session was not destroyed", err);
    });
  }
  return authd;
};

// ! passport-http
