import { ApolloServer } from "apollo-server-express";

import { IContext } from "../server.d";
import { resolvers, typeDefs } from "./schema";

const apollo = new ApolloServer({
  context: ({ req }: IContext) => {
    // get the user token from the headers
    const token = req.headers.authorization || "";

    // try to retrieve a user with the token
    // const user = getUser(token); // ! i make this?

    // add the user to the context
    return { req };
  },
  resolvers,
  typeDefs
});

export default apollo;
