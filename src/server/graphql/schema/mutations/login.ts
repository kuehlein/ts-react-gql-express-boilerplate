import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    login(email: String!, password: String!): User!
  }
`;

// ! types are probably messed up
