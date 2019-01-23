import gql from "graphql-tag";

export default gql`
  query login($email: String, $username: String, $password: String!) {
    login(email: $email, username: $username, password: $password) {
      id
    }
  }
`;
