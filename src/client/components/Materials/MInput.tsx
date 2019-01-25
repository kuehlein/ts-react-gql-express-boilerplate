import startCase from "lodash/startCase";
import React, { SFC } from "react";

const materials = require("./materials.css");

interface IMInputProps {
  args?: any[];
  autoComplete?: "on" | "off";
  autoCorrect?: "on" | "off";
  autoFocus?: boolean;
  handleChange: (value: string, ...args: any[]) => any;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  maxLength?: number;
  name: string;
  placeholder?: string;
  shouldSpellcheck?: boolean;
  style?: "form" | "invalid" | "std"; // TODO: add more...
  type?:
    | "text"
    | "password"
    | "submit"
    | "reset"
    | "radio"
    | "checkbox"
    | "button"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "month"
    | "number"
    | "range"
    | "search"
    | "tel"
    | "time"
    | "url"
    | "week";
  value?: string;
}

/**
 *
 */
const MInput: SFC<IMInputProps> = ({
  args = [],
  autoComplete = "off",
  autoCorrect = "off",
  autoFocus = false,
  handleChange,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  maxLength = Infinity,
  name,
  placeholder = "", // ! ???
  shouldSpellcheck = false,
  style = "std",
  type = "text",
  value // ! ???
}) => {
  const formattedName = startCase(name);

  return (
    <label htmlFor="input">
      {formattedName}
      <input
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        className={materials[`${style}-input`]}
        disabled={isDisabled}
        maxLength={maxLength}
        name={name}
        onChange={event => handleChange(event.target.value, ...args)}
        placeholder={placeholder || formattedName}
        readOnly={isReadOnly}
        required={isRequired}
        spellCheck={shouldSpellcheck}
        type={type}
      />
    </label>
  );
};

MInput.defaultProps = {
  handleChange: () => {},
  name: ""
  // value: ""
};

export default MInput;
