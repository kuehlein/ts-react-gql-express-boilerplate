import { ISignupAndLogin } from "../../../types";

export interface ISignupAndLoginConfirmation extends ISignupAndLogin {
  confirmEmail: string;
  confirmPassword: string;
}

export interface ISignupAndLoginField {
  key: keyof ISignupAndLoginConfirmation;
  value: string;
}
