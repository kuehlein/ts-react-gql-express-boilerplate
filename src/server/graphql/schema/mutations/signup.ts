import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    signup(user: User, req: String): User!
  }
`;

// ! how do i establish `req` as type `Express.Request`?
// ! and `user` of type `User`?
