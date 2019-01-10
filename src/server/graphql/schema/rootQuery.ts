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
    user(id: String): User!
    logout(id: ID!): User!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Query: {
    logout: async (parent, args, { req }: IContext): Promise<User["id"]> => {
      console.log(req.session);
      console.log("WHY");
      const x = (await logout(req)) ? args.id : "user is not authenticated";
      console.log("logout ---------->", args.id);
      return args.id;
    },
    user: async (parent, { id }, context, info) =>
      await getRepository(User)
        .findOne({ where: { id } })
        .then(user => ({
          createdAt: user.createdAt,
          email: user.email
        }))
        .catch(err => err.messsage)
  }
};
