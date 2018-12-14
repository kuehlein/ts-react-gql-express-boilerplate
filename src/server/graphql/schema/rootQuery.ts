import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

export const typeDef: DocumentNode = gql`
  type Query {
    user: User!
    users: [User!]!
  }
`;

// Provide resolver functions for your schema fields
export const resolver: IResolvers = {
  Query: {
    user: (parent, args, context, info) => {
      const onlyUser = {
        createdAt: "???",
        email: "hi@gmail.com",
        firstName: "Sool",
        id: "1",
        lastName: "lol"
      };

      console.log(
        "context---------",
        JSON.stringify(context, null, 2),
        "\n info------",
        info
      );

      return onlyUser;
    }
    //   users: () => [
    //     { id: "1", email: "hi@gmail.com" },
    //     { id: "2", email: "world@gmail.com" }
    //   ]
  }
};
