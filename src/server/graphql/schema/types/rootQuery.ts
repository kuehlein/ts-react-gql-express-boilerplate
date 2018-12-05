import { gql } from "apollo-server-express";

// ! not sure about this one...

export default gql`
  type Query {
    user: User!
    users: [User!]!
  }
`;

// import { GraphQLID, GraphQLObjectType } from "graphql";

// const RootQuery = new GraphQLObjectType({
//   fields: {
//     dummyField: {
//       // ! this is a temporary field so gql doesnt complain
//       type: GraphQLID
//     }
//   },
//   name: "RootQuery"
// });

// export default RootQuery;
