import gql from "graphql-tag";

export default gql`
  mutation Signup($email: string, $password: string, $username: string) {
    signup(email: $email, password: $password, username: $username) {
      id
    }
  }
`;
