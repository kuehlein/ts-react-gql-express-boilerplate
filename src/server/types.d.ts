import { Request } from "express";
import { User } from "./db";
import { Connection } from "typeorm";

/**
 * GraphQL context object. Contains express `Request` object.
 */
export interface IContext {
  dbConnection?: Connection;
  req?: Request;
  user?: User | false;
}

/**
 * Extends `Error` by adding an optional `status` number.
 */
export interface ResponseError extends Error {
  status?: number;
}
