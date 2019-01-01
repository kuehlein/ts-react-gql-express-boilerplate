import { Request } from "express";
import { User } from "./db";

// declare module "lol" {
/**
 * GraphQL context object. Contains express `Request` object.
 */
export interface IContext {
  req: Request;
}

/**
 * Extends `Error` by adding an optional `status` number.
 */
export interface ResponseError extends Error {
  status?: number;
}
// }

// export as namespace lol; // ! ----

// ! what is the best practice, declaring a module
// ! or exporting types by themselves
// ! and if it is declaring a module,
// ! how do you make it visible to import?
