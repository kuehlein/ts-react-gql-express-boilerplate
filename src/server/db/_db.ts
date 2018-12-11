import { createConnection } from "typeorm";

const db = createConnection({
  cli: {
    entitiesDir: "ts-sourcemap/server/db/entities"
    // migrationsDir: "ts-sourcemap/server/db/migrations",
    // subscribersDir: "ts-sourcemap/server/db/subscribers"
  },
  database: "ts-react-gql-express-boilerplate",
  entities: ["ts-sourcemap/server/db/entities/"], // "*.js"
  // entitySchemas: ["ts-sourcemap/server/db/schemas/*.json"],
  host: "localhost",
  logging: false,
  // migrations: ["ts-sourcemap/server/db/migrations/*.js"],
  password: "password",
  port: 5432,
  // subscribers: ["ts-sourcemap/server/db/subscribers/*.js"],
  synchronize: process.env.NODE_ENV === "development",
  type: "postgres",
  username: "anon"
});

export default db;
