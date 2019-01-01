import { ApolloServer } from "apollo-server-express";

import { IContext } from "../server.d";
import { resolvers, typeDefs } from "./schema";

const gqlServer = new ApolloServer({
  context: ({ req }: IContext) => ({ req }),
  resolvers,
  typeDefs
});

export default gqlServer;
