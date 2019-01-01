import { gql } from "apollo-server-express";
import { IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { Address } from "../../db";

export const typeDef: DocumentNode = gql`
  type Address {
    city: String!
    country: String!
    googlePlaceId: String
    id: String!
    secondaryAddress: String
    state: String!
    streetAddress: String!
    streetName: String!
    zipCode: String!
    user: User!
  }
`;

export const resolver: IResolvers = {
  Address: {
    city: (root): Address["city"] => root.city,
    country: root => root.country,
    googlePlaceId: root => root.googlePlaceId,
    id: root => root.id,
    secondaryAddress: root => root.secondaryAddress,
    state: root => root.state,
    streetAddress: root => root.streetAddress,
    streetName: root => root.streetName,
    user: root => root.user,
    zipCode: root => root.zipCode
  }
};
