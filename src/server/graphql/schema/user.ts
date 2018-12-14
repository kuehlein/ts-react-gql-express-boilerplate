import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

// import { login, signup } from "../../auth";
// import { User } from "../../db";

// ! no password, should not need to query password

export const typeDef: DocumentNode = gql`
  type User {
    id: ID!
    email: String!
  }
  # type Mutation {
  #   login(email: User[email]!, password: User[password]!): User!
  #   logout(id: User[id])
  #   signup(user: User): User!
  # }
`;

/*

export const typeDef = gql`
  type User {
    # birthday: Date!
    # createdAt: Date!
    email: String!
    # firstName: String!
    # googleId: String
    id: ID!
    # lastName: String!
    # phoneNumber: String
  }
`;

*/

export const resolver: IResolvers = {
  // ! how to replace `req` --- or keep `req`???
  User: {
    //   birthday: root => root.birthday, // * how do i do this root thing?
    //   createdAt: root => root.createdAt,
    email: email => email, // * root => root.email,
    //   firstName: root => root.firstName,
    //   googleId: root => root.googleId,
    id: id => id // * root => root.id // ? root ?????????
    //   lastName: root => root.lastName,
    //   login: (email: User["email"], password: User["password"]) =>
    //     login(email, password),
    //   logout: (id: User["id"]) => ({}),
    //   phoneNumber: root => root.phoneNumber,
    //   signup: (user: User) => signup(user)
  }
};
