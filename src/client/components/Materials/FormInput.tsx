import startCase from "lodash/startCase";
import React, { SFC } from "react";

import { isEmail } from "../../../utils";

/**
 * Utility function to check for a valid input for email,
 * username and password.
 */
const checkForValidInput = {
  email: (field: string): string => (isEmail(field) ? "" : "invalid"),
  password: (field: string): string => (field.length > 7 ? "" : "invalid"),
  username: (field: string): string => (field.length > 3 ? "" : "invalid")
};

interface IFormInputProps {
  autoComplete?: "on" | "off";
  autoCorrect?: "on" | "off";
  autoFocus?: boolean;
  handleChange: (value: string, ...args: any[]) => any;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  name: string;
  pattern?: string;
  placeholder?: string;
  shouldSpellcheck?: boolean;
  value: string;
}

/**
 *
 */
const FormInput: SFC<IFormInputProps> = ({
  autoComplete = "off",
  autoCorrect = "off",
  autoFocus = false,
  handleChange,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  maxLength = Infinity,
  name,
  pattern,
  placeholder = "", // ! ???
  shouldSpellcheck = false,
  value
}) => {
  const formattedName = startCase(name);

  return (
    <label htmlFor="input">
      {formattedName}
      <input
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        className={checkForValidInput[name](value)}
        disabled={isDisabled}
        maxLength={maxLength}
        name={name}
        onChange={event => handleChange(event.target.value, name)}
        pattern={pattern}
        placeholder={placeholder || formattedName}
        readOnly={isReadOnly}
        required={isRequired}
        spellCheck={shouldSpellcheck}
        type={name === "password" ? "password" : "text"}
      />
    </label>
  );
};

FormInput.defaultProps = {
  handleChange: () => {},
  name: "",
  shouldSpellcheck: false,
  value: ""
};

export default FormInput;
