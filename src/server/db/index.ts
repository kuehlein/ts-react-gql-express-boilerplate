import { default as db } from "./_db";

// register entities (models)
import "./entities";

export default db;
export * from "./entities";
