import startCase from "lodash/startCase";
import React, { SFC } from "react";

import { Button } from "./index";

interface IFormInputProps {
  args?: any[];
  handleSubmit: (...args: any[]) => any;
  name: string;
  redirect?: string;
  style?: "signup-login" | ""; // ! ???
}

/**
 * form boi...
 */
const FormInput: SFC<IFormInputProps> = ({
  args = [],
  children,
  handleSubmit,
  name,
  redirect,
  style
}) => {
  return (
    <form className={`${style}-form`}>
      <label>
        <h2>{startCase(name)}</h2>
      </label>
      {children}
      <Button
        args={args}
        handleClick={handleSubmit}
        name="Submit"
        style="submit"
        redirect={redirect}
      />
    </form>
  );
};

FormInput.defaultProps = {
  handleSubmit: () => {},
  name: ""
};

export default FormInput;
