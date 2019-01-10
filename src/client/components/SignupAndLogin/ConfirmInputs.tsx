import _ from "lodash";
import React, { SFC } from "react";

import { IConfirmFields, ILoginState, ISignupState } from "./";
import { IFormInputsProps } from "./FormInputs";

/**
 * Utility function to check two fields for equality.
 */
const checkForValidConfirmationInput = (
  user: ISignupState,
  key1: keyof IConfirmFields,
  key2: keyof ILoginState
): string => (user[key1] === user[key2] ? "" : "invalid-field");

const FieldConfirm: SFC<IFormInputsProps> = ({ user, handleChange, field }) => {
  const fieldLabel = _.startCase(field);

  // "password" || "email"
  const counterpart = fieldLabel
    .split(" ")[1]
    .toLowerCase() as keyof ILoginState;

  // const debouncedHandleChange = _.debounce(handleChange, 300);

  // const eventHandler = (value: string) => {
  //   debouncedHandleChange(field, value);
  // };

  return (
    <label htmlFor="input">
      {fieldLabel}
      <input
        className={
          user[field]
            ? checkForValidConfirmationInput(
                user,
                field as keyof IConfirmFields,
                counterpart
              )
            : ""
        }
        onChange={e => handleChange(field, e.target.value)}
        placeholder={fieldLabel}
        required
        type={field === "confirmPassword" ? "password" : "text"}
      />
    </label>
  );
};

const ConfirmInputs: SFC<IFormInputsProps> = ({ handleChange, user }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <FieldConfirm
        user={user}
        handleChange={handleChange}
        field={"confirmEmail" as keyof IConfirmFields}
      />
      <FieldConfirm
        user={user}
        handleChange={handleChange}
        field={"confirmPassword" as keyof IConfirmFields}
      />
    </div>
  );
};

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
FieldConfirm.defaultProps = defaultProps;
ConfirmInputs.defaultProps = defaultProps;

export default ConfirmInputs;
