import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { getRepository } from "typeorm";

import { User } from "../../db";

export const typeDef: DocumentNode = gql`
  type Query {
    """
    Queries a single user given an email
    """
    user(email: String): ID!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Query: {
    user: async (parent, { email }, context, info) =>
      await getRepository(User)
        .findOne({ where: { email } })
        .then(user => user.id)
        .catch(err => err.messsage)
  }
};
