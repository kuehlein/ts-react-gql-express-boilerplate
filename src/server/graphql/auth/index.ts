// import { Request } from "express";
// import passport from "passport";
// import { getRepository } from "typeorm";

// // ! import { newAddress, newUser } from "../../../typings";
// import { Address, User } from "../../db";
// import { throwIfError } from "../../utils";

// // Provides an identifying token (user's id) to be used in the user's session
// passport.serializeUser((user: User, done) => done(null, user.id));

// // Given a user's ID, return the user object. This object is placed on `req.user`.
// passport.deserializeUser(async (id: User["id"], done) => {
//   const user = await User.findOne(id);
//   done(null, user);
// });

// /**
//  * Creates a new user account and logs them in using `req.login`. If the provided email is already in use
//  * or no email or password is provided, an error will be thrown.
//  */
// export const signup = async (
//   user: newUser,
//   addresses: newAddress[],
//   req: Request
// ): Promise<void> => {
//   if (!user.get("email") || !user.get("password")) {
//     throw new Error("You must provide an email and password.");
//   }

//   const createdUser = new User();
//   user.forEach((value, key) => (createdUser[key] = value));

//   createdUser.addresses = [];
//   addresses.forEach((address, i) =>
//     address.forEach((value, key) => (createdUser.addresses[i][key] = value))
//   );

//   return createdUser
//     .save()
//     .then(async savedUser =>
//       req.logIn(savedUser, err => throwIfError(err, err, savedUser))
//     )
//     .catch(err => console.log("need to handle this (in auth)", err));
// };

// /**
//  * Logs in an existing user. Since GraphQL expects a promsie,
//  * `async` is used. Also, `passport.authenticate` returns a function,
//  * hence the strange syntax.
//  */
// export const login = async (
//   email: User["email"],
//   password: User["password"],
//   req: Request
// ): Promise<User> =>
//   passport.authenticate("local", (err, user) => {
//     if (!user) throw new Error("Invalid Credentials");
//     req.logIn(user, err => throwIfError(err, err, user)); // ({ body: { email, password } });
//   });

// /**
//  * Logs out the currently logged in user, and destroys the session.
//  */
// export const logout = (req: Request): User["id"] => {
//   const id = req.user.id;
//   req.logout();
//   req.session.destroy(err => console.log("expects callback", err));
//   // res.redirect("/");
//   return id;
// };
