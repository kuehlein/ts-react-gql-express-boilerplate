import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

// ! import { newAddress, newUser } from "../../../typings";
import { User } from "../../db";
import { IContext } from "../../server.d";
// ! import { login, logout, signup } from "../auth";

export const typeDef: DocumentNode = gql`
  scalar Date

  type User {
    avatar: String
    birthday: Date!
    createdAt: Date!
    email: String!
    firstName: String!
    googleId: String
    id: ID!
    lastName: String!
    phoneNumber: String
    username: String!
  }
  type Mutation { # ! should these be seperate?
    login(email: String!, password: String!): ID!
    # logout(): ID!
    # me(): User!
    signup(
      # user: User!
      # {
      avatar: String
      birthday: String!
      email: String!
      firstName: String!
      googleId: String
      lastName: String!
      password: String!
      phoneNumber: String
      username: String!
      # },
      # address: Address!
      # {
      city: String!
      country: String!
      googlePlaceId: String
      id: String!
      secondaryAddress: String
      state: String!
      streetAddress: String!
      streetName: String!
      zipCode: String! # user: User! # }
    ): ID!
  }
`;

export const resolver: IResolvers = {
  Mutation: {
    // ! login: (parent, { email, password }, { req }: IContext) =>
    // !  login(email, password, req),
    // ! logout: (parent, { id }, { req }: IContext) => logout(req),
    // me: (parent, args, { req }: IContext) => JSON.stringify(req.user),
    // ! signup: (
    // !  parent,
    // !  { user, address }: { user: newUser; address: newAddress[] },
    // !  { req }: IContext
    // ! ) => signup(user, address, req)
  },
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
