import { DocumentNode } from "graphql";

import { Login, Logout, Signup } from "./mutations";
import { RootQuery, User } from "./types";

export const typeDefs: DocumentNode = Object.assign(
  {},
  Login,
  Logout,
  Signup,
  RootQuery,
  User
);
export { default as resolvers } from "./resolvers";
