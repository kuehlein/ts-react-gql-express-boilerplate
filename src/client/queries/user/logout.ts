import gql from "graphql-tag";

export default gql`
  logout($id: ID!) {
    logout(id: $id) {
      id
    }
  }
`;
