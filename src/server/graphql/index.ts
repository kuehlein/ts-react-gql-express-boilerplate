import { ApolloServer } from "apollo-server-express";

import { signup } from "../auth";
// import { Signup } from "./schema/mutations";

// * querys + mutations ---> typeDefs
import userSchema from "./schema/types/user";

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    user: () => ({ id: "1", email: "hi@gmail.com" }),
    users: () => [
      { id: "1", email: "hi@gmail.com" },
      { id: "2", email: "world@gmail.com" }
    ]
  },
  User: {
    // email: root => root.email, // ?????????
    // id: root => root.id,
    signup: (parentValue, { email, password }, req) =>
      signup({ email, password, req })
  }
};

const gqlServer = new ApolloServer({
  resolvers,
  typeDefs: userSchema
});

export default gqlServer;
