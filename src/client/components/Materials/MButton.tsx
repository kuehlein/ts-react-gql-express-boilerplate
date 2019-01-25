import React, { SFC } from "react";

import history from "../../history";

interface IMButtonProps {
  args?: any[];
  disabled?: boolean;
  handleClick?: (...args: any[]) => void;
  name: string;
  redirect?: string;
  style?: "submit" | "std";
  type?: "submit" | "reset";
}

/**
 * generic button
 */
const MButton: SFC<IMButtonProps> = ({
  args = [],
  disabled = false,
  handleClick = () => {},
  name,
  redirect,
  style = "std",
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

MButton.defaultProps = {
  name: ""
};

export default MButton;
