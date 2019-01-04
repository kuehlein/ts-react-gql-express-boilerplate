import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { ISignupAndLogin } from "../../../typings";
import { User } from "../../db";
import { IContext } from "../../server.d";
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
  # type Query {
  #   login(email: String!, password: String!): ID!
  #   # logout(id: ID!): User! # need a name...
  #   # me(): User!
  # }
  type Mutation { # ! should these be seperate?
    signup(email: String!, password: String!, username: String!): User!
  }
`;

export const resolver: IResolvers = {
  Mutation: {
    signup: async (
      parent,
      { email, password, username }: ISignupAndLogin,
      { req }: IContext
    ) => await signup(req, { email, password, username })
  },
  // Query: {
  //   login: (parent, { email, password, username }, { req }: IContext) =>
  //     login(email, password, username, req),
  //   logout: (parent, args, { req }: IContext) => logout(req)
  //   // me: (parent, args, { req }: IContext) => JSON.stringify(req.user),
  // },
  User: {
    avatar: (root): User["avatar"] => root.avatar,
    birthday: root => root.birthday,
    createdAt: root => root.createdAt,
    email: root => root.email,
    firstName: root => root.firstName,
    googleId: root => root.googleId,
    id: root => root.id,
    lastName: root => root.lastName,
    phoneNumber: root => root.phoneNumber,
    username: root => root.username
  }
};
