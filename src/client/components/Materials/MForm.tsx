import startCase from "lodash/startCase";
import React, { SFC } from "react";

import { MButton } from "./index";

interface IMFormProps {
  args?: any[];
  disableSubmit?: boolean;
  handleSubmit: (...args: any[]) => void;
  name: string;
  redirect?: string;
  style?: "signup-login" | "std"; // ! ???
}

/**
 * form boi...
 */
const MForm: SFC<IMFormProps> = ({
  args = [],
  children,
  disableSubmit = false,
  handleSubmit,
  name,
  redirect,
  style = "std"
}) => {
  return (
    <form className={`${style}-form`}>
      <label>
        <h2>{startCase(name)}</h2>
      </label>

      {/* fields/inputs/etc. that Form will contain */}
      {children}

      <MButton
        args={args}
        disabled={disableSubmit}
        handleClick={handleSubmit}
        name="Submit"
        style="submit"
        redirect={redirect}
      />
    </form>
  );
};

MForm.defaultProps = {
  handleSubmit: () => {},
  name: ""
};

export default MForm;
