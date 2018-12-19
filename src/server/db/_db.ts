import { createConnection } from "typeorm";

export default createConnection({
  cli: {
    entitiesDir: "ts-sourcemap/server/db/entities"
  },
  database: "ts_react_gql_express_boilerplate",
  entities: ["ts-sourcemap/server/db/entities/*.js"],
  host: "localhost",
  logging: false,
  password: "password",
  port: 5432,
  synchronize: process.env.NODE_ENV !== "production",
  type: "postgres",
  username: "kyleuehlein"
});
