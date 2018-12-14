import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

export const Date = {
  Date: new GraphQLScalarType({
    description: "Date custom scalar type",
    name: "Date",
    parseLiteral: ast =>
      ast.kind === Kind.INT
        ? new Date(ast.value) // ast value is always in string format
        : null,
    parseValue: value => new Date(value), // value from the client
    serialize: value => value.getTime() // value sent to the client
  })
};
