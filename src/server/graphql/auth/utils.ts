import { Request } from "express";
import { ISignupAndLogin } from "../../../types";
import { isValid } from "../../../utils";

/**
 * Adds the user's information to the request body
 * for use with the local strategy
 */
export const addUserToReq = (
  req: Request,
  user: ISignupAndLogin,
  password?: string
): Request => {
  req.body.username = user.username;
  req.body.password = password || user.password;
  return req;
};

/**
 * Checks the input string for valid email
 * and returns a either `"email"` or `"username"`.
 */
export const checkEmailOrUsername = (str: string): "email" | "username" =>
  isValid.email(str) ? "email" : "username";
