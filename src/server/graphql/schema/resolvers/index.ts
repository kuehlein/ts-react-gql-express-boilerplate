import { IResolvers } from "apollo-server-express";

import { signup } from "../../../auth";
import { User } from "../../../db";

// Provide resolver functions for your schema fields
const resolvers: IResolvers = {
  Query: {
    user: () => ({ id: "1", email: "hi@gmail.com" }),
    users: () => [
      { id: "1", email: "hi@gmail.com" },
      { id: "2", email: "world@gmail.com" }
    ]
  },
  User: {
    email: root => root.email, // ? root ?????????
    id: root => root.id,
    // login: (parentValue, user: User, req) => signup(user, req),
    // logout: (parentValue, user: User, req) => signup(user, req),
    signup: (parentValue, user: User, req) => signup(user, req) // ! does this behave like `graphql` library?
  }
};

export default resolvers;

/*

const { GraphQLObjectType, GraphQLString } = require('graphql');

const AuthService = require('../services/auth');
const UserType = require('./types/user_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req })
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req
        req.logout()
        return user
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req })
      }
    }
  }
})

*/
