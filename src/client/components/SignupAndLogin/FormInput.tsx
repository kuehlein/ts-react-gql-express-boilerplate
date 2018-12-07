import _ from "lodash";
import React, { SFC } from "react";

import { ILoginState, ISignupState } from "./";

interface IFormInputProps {
  content: string;
  handleChange: (
    placeholder: keyof ILoginState | keyof ISignupState,
    value: string
  ) => void;
  placeholder: keyof ILoginState | keyof ISignupState;
}

const FormInput: SFC<IFormInputProps> = ({
  content,
  handleChange,
  placeholder
}) => (
  <>
    <label htmlFor="input">
      {_.capitalize(placeholder)}
      <input
        onChange={e => handleChange(placeholder, e.target.value)}
        placeholder={placeholder}
        value={content}
      />
    </label>
    <hr />
  </>
);

FormInput.defaultProps = {
  content: "",
  handleChange: () => {}
};

export default FormInput;
