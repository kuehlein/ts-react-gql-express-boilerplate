import gql from "graphql-tag";

export default gql`
  mutation Signup($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      id
    }
  }
`;
