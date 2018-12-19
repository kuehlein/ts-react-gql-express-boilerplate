import gql from "graphql-tag";

export default gql`
  login($email: String, $password: String!) {
    login(email: $email, password: $password) {
      id
    }
  }
`;
