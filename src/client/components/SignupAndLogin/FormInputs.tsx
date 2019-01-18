import _ from "lodash";
import React, { SFC } from "react";

import { isEmail } from "../../../utils";
import {
  IFormInputsProps,
  ILoginState,
  ISignupAndLoginProps,
  ISignupState
} from "./types";

/**
 * Utility function to check for a valid input for email,
 * username and password.
 */
const checkForValidInput = (
  user: ISignupState,
  key: keyof ILoginState,
  formType?: ISignupAndLoginProps["formType"]
) => {
  if (!user[key] || formType === "Login") return true;
  if (key === "email") return isEmail(user.email);
  // ! make it more complex later vvv
  if (key === "username") return user.username.length > 3;
  if (key === "password") return user.password.length > 7;
  // ! make it more complex later ^^^
};

interface IDynamicLoginInputs extends IFormInputsProps {
  formType?: ISignupAndLoginProps["formType"];
}

/**
 * Individual field for `Signup` or `Login`. Validates input, and updates state.
 */
const FieldPrompt: SFC<IDynamicLoginInputs> = ({
  field,
  formType,
  handleChange,
  user
}) => {
  const fieldLabel =
    formType === "Login" && field === "username"
      ? "username/email"
      : _.startCase(field);

  return (
    <label htmlFor="input">
      {fieldLabel}
      <input
        className={
          checkForValidInput(user, field as keyof ILoginState, formType)
            ? ""
            : "invalid-field"
        }
        onChange={e => handleChange(field, e.target.value)}
        placeholder={fieldLabel}
        required
        spellCheck={false}
        type={field === "password" ? "password" : "text"}
      />
    </label>
  );
};

/**
 * Template for `Login` input fields.
 */
const FormInputs: SFC<IDynamicLoginInputs> = ({
  formType,
  handleChange,
  user
}) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <FieldPrompt
      field={"username"}
      formType={formType}
      handleChange={handleChange}
      user={user}
    />
    {formType === "Signup" && (
      <FieldPrompt field={"email"} handleChange={handleChange} user={user} />
    )}
    <FieldPrompt
      field={"password"}
      formType={formType}
      handleChange={handleChange}
      user={user}
    />
  </div>
);

const defaultProps = {
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
