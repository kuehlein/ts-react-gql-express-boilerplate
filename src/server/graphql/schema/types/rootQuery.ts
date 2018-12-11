import { gql } from "apollo-server-express";

export default gql`
  type Query {
    user: User!
    users: [User!]!
  }
`;
