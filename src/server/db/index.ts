import db from "./_db";

// register entities (models)
import "./entities/User";

export default db;
export { default as User } from "./entities/User";
