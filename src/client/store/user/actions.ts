import { action } from "typesafe-actions";

import { SET_FIELD } from "./constants";
import { ISignupAndLoginConfirmation, ISignupAndLoginField } from "./models";

export const setLoginField = (
  key: keyof ISignupAndLoginConfirmation,
  value: string
) =>
  action(SET_FIELD, {
    key,
    value
  } as ISignupAndLoginField);
