import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import _ from "lodash";

// typeDefs
import { typeDef as AddressType } from "./address";
import { typeDef as RootQueryType } from "./rootQuery";
import { typeDef as UserTypeDef } from "./user";

export const typeDefs: DocumentNode[] = [
  AddressType,
  RootQueryType,
  UserTypeDef
];

// resolvers
import { resolver as AddressResolver } from "./address";
import { resolver as RootQueryResolver } from "./rootQuery";
import { Date } from "./scalars";
import { resolver as UserResolver } from "./user";

export const resolvers: IResolvers = _.merge(
  AddressResolver,
  Date,
  RootQueryResolver,
  UserResolver
);
