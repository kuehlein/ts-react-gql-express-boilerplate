import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import _ from "lodash";

import { User } from "../../db";
import { IContext } from "../../types";

export const typeDef: DocumentNode = gql`
  type Query {
    """
    Queries a single user given an email
    """
    user(id: String, keys: [String!]): User!
  }
  type Mutation {
    """
    Dummy field since Mutation cannot be empty.
    """
    filler(str: String): ID!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Mutation: {
    filler: () => "this is filler"
  },
  Query: {
    user: async (
      parent,
      { id, keys }: IUserQuery,
      { dbConnection }: IContext,
      info
    ): Promise<User> =>
      await dbConnection
        .getRepository(User)
        .findOne({ where: { id } })
        .then(user => _.pick(user, keys))
        .catch(err => err.messsage)
  }
};

interface IUserQuery {
  id: string;
  keys: string[];
}
