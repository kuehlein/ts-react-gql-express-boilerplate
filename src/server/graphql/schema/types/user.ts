import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: ID!
    email: String!
  }
`;

// import { GraphQLObjectType, GraphQLString } from "graphql";

// const User: GraphQLObjectType = new GraphQLObjectType({
//   fields: {
//     email: { type: GraphQLString }
//   },
//   name: "User"
// });

// export default User;
