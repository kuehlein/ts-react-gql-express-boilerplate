import { ApolloServer } from "apollo-server-express";
// import { makeExecutableSchema } from "apollo-server-express";

import { resolvers, typeDefs } from "./schema";

const gqlServer = new ApolloServer({
  resolvers,
  typeDefs
});

export default gqlServer;

// ! this is not how to combine these dudes
// ! figure out how to do this
// export const typeDefs = makeExecutableSchema({
//   resolvers: _.merge(/* resolvers */),
// typeDefs: [Login, Logout, RootQuery, Signup, User]
// });
