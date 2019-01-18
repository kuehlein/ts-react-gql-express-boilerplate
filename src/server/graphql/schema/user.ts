import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { ISignupAndLogin } from "../../../types";
import { User } from "../../db";
import { IContext } from "../../types";
import { login, logout, signup } from "../auth";

export const typeDef: DocumentNode = gql`
  scalar Date

  type User {
    avatar: String
    birthday: Date
    createdAt: Date
    email: String!
    firstName: String
    googleId: String
    id: ID!
    lastName: String
    phoneNumber: String
    username: String!
  }
  extend type Query {
    login(email: String, username: String, password: String!): User!
    logout: User!
    # me(): User!
  }
  extend type Mutation {
    signup(email: String!, password: String!, username: String!): User!
  }
`;

export const resolver: IResolvers = {
  Mutation: {
    signup: async (
      parent,
      { email, password, username }: ISignupAndLogin,
      { req }: IContext
    ): Promise<User> => await signup(req, { email, password, username })
  },
  Query: {
    login: async (parent, args, { req }: IContext): Promise<User> =>
      await login(req, args as ISignupAndLogin),
    logout: async (parent, args, { req, user }: IContext): Promise<User> => {
      if (user) return await logout(req);
      // ! how to handle no user??
    }
    // me: (parent, args, { req }: IContext) => JSON.stringify(req.user),
  }
};
