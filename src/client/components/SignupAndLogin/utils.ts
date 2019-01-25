import { isValid } from "../../../utils";
import { ISignupState } from "./types";

/**
 * Checks form state for valid inputs before form submission.
 */
export const isFormValid = (user: ISignupState): boolean =>
  user.email === user.confirmEmail &&
  user.password === user.confirmPassword &&
  isValid.email(user.email) &&
  isValid.password(user.password) &&
  isValid.username(user.username);
