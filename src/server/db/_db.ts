import { createConnection } from "typeorm";

export default createConnection({
  cli: {
    entitiesDir: "ts-sourcemap/server/db/entities"
    // migrationsDir: "ts-sourcemap/server/db/migrations",
    // subscribersDir: "ts-sourcemap/server/db/subscribers"
  },
  database: "ts_react_gql_express_boilerplate",
  entities: ["ts-sourcemap/server/db/entities/*.js"], // "*.js"
  // entitySchemas: ["ts-sourcemap/server/db/schemas/*.json"],
  host: "localhost",
  logging: false,
  // migrations: ["ts-sourcemap/server/db/migrations/*.js"],
  password: "password",
  port: 5432,
  // subscribers: ["ts-sourcemap/server/db/subscribers/*.js"],
  synchronize: process.env.NODE_ENV === "development",
  type: "postgres",
  username: "kyleuehlein" // ! ----- change this ------
});
