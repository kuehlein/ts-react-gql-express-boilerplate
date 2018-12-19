import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { User } from "../../db";

export const typeDef: DocumentNode = gql`
  type Query {
    "Queries a single user given an email"
    user(email: String): User!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Query: {
    user: async (parent, { email }, context, info) => {
      console.log("email----------------", email);
      const user = await User.findOne({ where: { email } }); // .then(user => user.id);
      console.log(user);
      return user.id;
    }
  }
};
