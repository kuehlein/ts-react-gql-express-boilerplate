import { gql } from "apollo-server-express";

const Signup = gql`
  type Mutation {
    signup(email: String!, password: String!): User!
  }
`;

export default Signup;

// import { GraphQLObjectType, GraphQLString } from "graphql";

// const Signup = new GraphQLObjectType({
//   fields: {
//     signup: {
//       args: {
//         email: { type: GraphQLString },
//         password: { type: GraphQLString }
//       },
//       resolve: (parentValue, { email, password }, req) =>
//         signup({ email, password, req }),
//       type: User
//     }
//   },
//   name: "Signup"
// });
