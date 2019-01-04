import _ from "lodash";
import React, { SFC } from "react";

import { ILoginState, ISignupState } from "./";

/**
 * Utility function to check two fields for equality.
 */
const checkForValidInput = (
  user: ISignupState | ILoginState,
  key1: keyof ISignupState | keyof ILoginState,
  key2: keyof ISignupState | keyof ILoginState
): string => (user[key1] === user[key2] ? "" : "invalid-field");

interface IFormInputsProps {
  handleChange: (
    key: keyof ISignupState | keyof ILoginState,
    value: string
  ) => void;
  field?: keyof ISignupState | keyof ILoginState;
  isConfirm?: boolean;
  user: ISignupState | ILoginState;
}

const FieldConfirm: SFC<IFormInputsProps> = ({ user, handleChange, field }) => {
  const confirmField = `confirm${_.capitalize(field)}` as keyof ISignupState;
  return (
    <label htmlFor="input">
      {_.startCase(confirmField)}
      <input
        className={
          (user as ISignupState)[confirmField]
            ? checkForValidInput(user, field, confirmField)
            : ""
        }
        onChange={e => handleChange(confirmField, e.target.value)}
        placeholder={_.startCase(confirmField)}
        required
        type={field === "password" ? "password" : "text"}
        value={(user as ISignupState)[confirmField]}
      />
    </label>
  );
};

const FieldPrompt: SFC<IFormInputsProps> = ({ user, handleChange, field }) => (
  <label htmlFor="input">
    {_.startCase(field)}
    <input
      className=""
      onChange={e => handleChange(field, e.target.value)}
      placeholder={_.startCase(field)}
      required
      type={field === "password" ? "password" : "text"}
      value={user[field]}
    />
  </label>
);

const FormInputs: SFC<IFormInputsProps> = ({
  handleChange,
  isConfirm,
  user
}) => {
  const InputField = isConfirm ? FieldConfirm : FieldPrompt;
  return (
    <>
      <InputField user={user} handleChange={handleChange} field={"email"} />
      <InputField user={user} handleChange={handleChange} field={"password"} />
      {!isConfirm && (
        <FieldPrompt
          user={user}
          handleChange={handleChange}
          field={"username"}
        />
      )}
    </>
  );
};

const defaultProps = {
  formType: "Signup",
  handleChange: () => {},
  handleSubmit: () => {},
  user: {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: "",
    username: ""
  }
};
FieldConfirm.defaultProps = defaultProps;
FieldPrompt.defaultProps = defaultProps;
FormInputs.defaultProps = defaultProps;

export default FormInputs;
