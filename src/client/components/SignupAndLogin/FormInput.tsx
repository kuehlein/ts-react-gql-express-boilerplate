import React, { SFC } from "react";

import { ISignupAndLoginState, IUpdateStateArg } from "./";

interface IFormInputProps {
  content: string;
  handleChange: ({ key, value }: IUpdateStateArg) => void;
  placeholder: keyof ISignupAndLoginState;
}

const FormInput: SFC<IFormInputProps> = ({
  content,
  handleChange,
  placeholder
}) => (
  <>
    <label htmlFor="input">{placeholder}</label> {/* to uppercase? */}
    <input
      onChange={e => handleChange({ key: placeholder, value: e.target.value })}
      placeholder={placeholder}
      value={content}
    />
    <hr />
  </>
);

FormInput.defaultProps = {
  content: "",
  handleChange: () => {}
};

export default FormInput;
