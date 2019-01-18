import { ApolloServer } from "apollo-server-express";
import { Connection } from "typeorm";

import { User } from "../db";
import { IContext } from "../types";
import { resolvers, typeDefs } from "./schema";

const apollo = (dbConnection?: Connection): ApolloServer =>
  new ApolloServer({
    context: async ({ req }: IContext): Promise<ApolloServer["context"]> => {
      // https://www.apollographql.com/docs/apollo-server/v2/features/authentication.html

      const user: User | false = req.isAuthenticated() ? req.user : false;

      // add the user to the context
      return { dbConnection, req, user };
    },
    resolvers,
    typeDefs
  });

export default apollo;
