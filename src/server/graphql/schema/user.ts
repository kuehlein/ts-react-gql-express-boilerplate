import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

// import { login, signup } from "../../auth";
// import { User } from "../../db";

// ! no password, should not need to query password

export const typeDef: DocumentNode = gql`
  scalar Date

  type User {
    birthday: Date!
    createdAt: Date!
    email: String!
    firstName: String!
    googleId: String
    id: ID!
    lastName: String!
    phoneNumber: String
  }
  # type Mutation {
  #   login(email: User[email]!, password: User[password]!): User!
  #   logout(id: User[id])
  #   signup(user: User): User!
  # }
`;

export const resolver: IResolvers = {
  // ! how to replace `req` --- or keep `req`???
  User: {
    birthday: user => user.birthday,
    createdAt: user => user.createdAt,
    email: email => email, // * user => user.email,
    firstName: user => user.firstName,
    googleId: user => user.googleId,
    id: id => id, // * user => user.id // ? user ?????????
    lastName: user => user.lastName,
    //   login: (email: User["email"], password: User["password"]) =>
    //     login(email, password),
    //   logout: (id: User["id"]) => ({}),
    phoneNumber: user => user.phoneNumber
    //   signup: (user: User) => signup(user)
  }
};
