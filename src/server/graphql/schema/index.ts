import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import _ from "lodash";

// typeDefs
import { typeDef as RootQueryType } from "./rootQuery";
import { typeDef as UserTypeDef } from "./user";

export const typeDefs: DocumentNode[] = [RootQueryType, UserTypeDef];

// resolvers
import { resolver as RootQueryResolver } from "./rootQuery";
import { resolver as UserResolver } from "./user";

export const resolvers: IResolvers = _.merge(RootQueryResolver, UserResolver);
