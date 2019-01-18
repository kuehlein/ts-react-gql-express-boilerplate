// Various types used in multiple places throughout `SignupAndLogin/`

/**
 * Props recieved through the root component of `SignupAndLogin/`.
 * These props are passed down to determine how the `Form` component
 * is constructed.
 */
export interface ISignupAndLoginProps {
  formType: "Signup" | "Login" | "Logout";
}

/**
 * Props recieved by input fields for both `Signup` and `Login`
 */
export interface IFormInputsProps {
  handleChange: (key: keyof ISignupState, value: string) => void;
  field?: keyof ILoginState | keyof IConfirmFields;
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
