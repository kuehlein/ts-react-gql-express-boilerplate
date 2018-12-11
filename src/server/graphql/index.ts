import { ApolloServer } from "apollo-server-express";

import { resolvers, typeDefs } from "./schema";

const gqlServer = new ApolloServer({
  resolvers,
  typeDefs
});

export default gqlServer;

// * finish tutorial and get back to this
