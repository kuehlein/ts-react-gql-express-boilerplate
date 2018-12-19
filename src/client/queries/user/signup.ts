import gql from "graphql-tag";

export default gql`
  mutation signup($user: User!) {
    signup(user: $user) {
      id
    }
  }
`;
