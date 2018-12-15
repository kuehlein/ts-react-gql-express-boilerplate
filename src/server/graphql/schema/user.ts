import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { login, signup } from "../../auth";
import { User } from "../../db";

// ! no password, should not need to query password

export const typeDef: DocumentNode = gql`
  scalar Date

  type User {
    avatar: String!
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
  type Mutation {
    login(email: User[email]!, password: User[password]!): User!
    logout(id: User[id])
    signup(user: User): User!
  }
`;

// ! how to replace `req` --- or keep `req`???
export const resolver: IResolvers = {
  User: {
    avatar: root => root.avatar,
    birthday: root => root.birthday,
    createdAt: root => root.createdAt,
    email: email => email,
    firstName: root => root.firstName,
    googleId: root => root.googleId,
    id: id => id,
    lastName: root => root.lastName,
    // login: (email: User["email"], password: User["password"]) =>
    // login(email, password),
    // logout: (id: User["id"]) => ({}),
    phoneNumber: root => root.phoneNumber,
    // signup: (user: User) => signup(user)
    username: root => root.username
  }
};
