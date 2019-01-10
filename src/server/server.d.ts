import { Request, Response } from "express";
import { User } from "./db";

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
