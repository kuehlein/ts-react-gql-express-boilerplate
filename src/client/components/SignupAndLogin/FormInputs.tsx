import _ from "lodash";
import React, { SFC } from "react";

import { IConfirmFields, ILoginState, ISignupState } from ".";
import { isEmail } from "../../../utils";

/**
 * Utility function to check for a valid input.
 */
const checkForValidInput = (user: ISignupState, key: keyof ILoginState) => {
  if (key === "email") return isEmail(user.email);
  if (key === "username") return user.username.length > 3;
  // ! make it more complex later
  if (key === "password") return user.password.length > 7;
};

export interface IFormInputsProps {
  handleChange: (key: keyof ISignupState, value: string) => void;
  field?: keyof ILoginState | keyof IConfirmFields;
  user: ISignupState;
}

const FieldPrompt: SFC<IFormInputsProps> = ({ user, handleChange, field }) => {
  const fieldLabel = _.startCase(field);
  return (
    <label htmlFor="input">
      {fieldLabel}
      <input
        className={
          // if valid || empty => true : false
          checkForValidInput(user, field as keyof ILoginState) || !user[field]
            ? ""
            : "invalid-field"
        }
        onChange={e => handleChange(field, e.target.value)}
        placeholder={fieldLabel}
        required
        type={field === "password" ? "password" : "text"}
      />
    </label>
  );
};

const FormInputs: SFC<IFormInputsProps> = ({ handleChange, user }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <FieldPrompt user={user} handleChange={handleChange} field={"email"} />
    <FieldPrompt user={user} handleChange={handleChange} field={"password"} />
    <FieldPrompt user={user} handleChange={handleChange} field={"username"} />
  </div>
);

const defaultProps = {
  formType: "Signup",
  handleChange: () => {},
  user: {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: "",
    username: ""
  }
};
FieldPrompt.defaultProps = defaultProps;
FormInputs.defaultProps = defaultProps;

export default FormInputs;
