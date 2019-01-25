import { ApolloClient } from "apollo-client";
import { MutationFn, OperationVariables } from "react-apollo";

// Various types used in multiple places throughout `SignupAndLogin/`

/**
 * Props recieved through the root component of `SignupAndLogin/`.
 * These props are passed down to determine how the `Form` component
 * is constructed.
 */
export interface ISignupAndLoginProps {
  formType: "Signup" | "Login";
}

/**
 * Props recievied from `SignupAndLogin`, and passed down to input components.
 */
export interface IFormProps {
  handleChange: (value: string, key: keyof ISignupState) => void;
  handleSubmit: (
    signup?: MutationFn<OperationVariables>,
    client?: ApolloClient<any>
  ) => void;
  user: ISignupState;
}

/**
 * Input fields used during `Signup`, along with their counterparts,
 * the input fields for `Login`.
 */
export interface IConfirmFields {
  confirmEmail: string;
  confirmPassword: string;
}

/**
 * Input fields used during `Login`. These fields are used with the
 * confirm fields for `Signup`.
 */
export interface ILoginState {
  email?: string;
  password: string;
  username: string;
}

/**
 * The full set of state for `SignupAndLogin/` comprised of all `Login`
 * fields, as well as the confirmation fields.
 */
export type ISignupState = ILoginState & IConfirmFields;

/**
 * !
 * !
 * ! FIGURE OUT SIGNUP VS. LOGIN STATE
 * !
 * !   - can i redo this?
 * !
 * !
 * !
 * !
 * !
 * !
 * !
 */
