import React, { SFC } from "react";

interface INavbarProps {
  formType: "Signup" | "Login";
  handleClick: (type: INavbarProps["formType"]) => void;
}

/**
 * Navbar...
 */
const Navbar: SFC<INavbarProps> = ({ formType, handleClick }) => {
  return (
    <div>
      <h2>logo</h2>
      <button
        disabled={formType === "Signup"}
        onClick={() => handleClick("Signup")}
      >
        Singup
      </button>
      <button
        disabled={formType === "Login"}
        onClick={() => handleClick("Login")}
      >
        Login
      </button>
    </div>
  );
};

export default Navbar;
