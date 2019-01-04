import gql from "graphql-tag";

export default gql`
  query logout($id: ID!) {
    logout(id: $id) {
      id
    }
  }
`;
