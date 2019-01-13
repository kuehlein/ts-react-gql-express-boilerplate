import { ApolloServer } from "apollo-server-express";
import { Connection } from "typeorm";

import { IContext } from "../server.d";
import { resolvers, typeDefs } from "./schema";

const apollo = (dbConnection?: Connection): ApolloServer =>
  new ApolloServer({
    context: async ({ req }: IContext): Promise<ApolloServer["context"]> => {
      // https://www.apollographql.com/docs/apollo-server/v2/features/authentication.html

      const user = req.isAuthenticated() ? req.user : false;

      // add the user to the context
      return { dbConnection, req, user };
    },
    resolvers,
    typeDefs
  });

export default apollo;
