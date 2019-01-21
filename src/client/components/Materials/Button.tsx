import React, { SFC } from "react";

import history from "../../history";

interface IButtonProps {
  args?: any[];
  disabled?: boolean;
  handleClick?: (...args: any[]) => any;
  name: string;
  redirect?: string;
  style?: "submit" | "";
  type?: "submit" | "reset";
}

/**
 * generic button
 */
const Button: SFC<IButtonProps> = ({
  args = [],
  disabled = false,
  handleClick = () => {},
  name,
  redirect,
  style,
  type = "button"
}) => (
  <button
    className={`${style}-button`}
    disabled={disabled}
    onClick={async () => {
      await handleClick(...args);
      if (redirect) history.push(redirect);
    }}
    type={type}
    value={name}
  >
    {name}
  </button>
);

Button.defaultProps = {
  name: "",
  style: ""
};

export default Button;
