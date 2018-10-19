import Sequelize from "sequelize";

const db = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://localhost:5432/ts-react-gql-express-boilerplate",
  {
    logging: false,
    operatorsAliases: false
  }
);

export default db;
