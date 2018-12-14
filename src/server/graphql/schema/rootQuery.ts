import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
  type Query {
    # root:
    user: User!
    # users: [User!]!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Query: {
    user: () => ({ id: "1", email: "hi@gmail.com" })
    //   users: () => [
    //     { id: "1", email: "hi@gmail.com" },
    //     { id: "2", email: "world@gmail.com" }
    //   ]
  }
};
