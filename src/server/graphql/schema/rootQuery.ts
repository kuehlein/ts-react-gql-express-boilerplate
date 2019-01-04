import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { getRepository } from "typeorm";

import { User } from "../../db";
import { IContext } from "../../server.d";
import { logout } from "../auth";

export const typeDef: DocumentNode = gql`
  type Query {
    """
    Queries a single user given an email
    """
    user(email: String): ID!
    logout(id: ID!): User!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Query: {
    logout: (parent, args, { req }: IContext) =>
      logout(req) ? args.id : "user is not authenticated",
    user: async (parent, { email }, context, info) =>
      await getRepository(User)
        .findOne({ where: { email } })
        .then(user => user.id)
        .catch(err => err.messsage)
  }
};
