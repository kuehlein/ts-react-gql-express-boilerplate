import ApolloClient from "apollo-client";
import React, { SFC } from "react";
import { ApolloConsumer } from "react-apollo";

interface INavbarProps {
  userCookie: string;
  formType: "Signup" | "Login" | "Logout";
  handleClick: (
    type?: INavbarProps["formType"],
    client?: ApolloClient<any>
  ) => void;
}

/**
 * Navbar...
 */
const Navbar: SFC<INavbarProps> = ({ userCookie, formType, handleClick }) => {
  // cookies.load("connect.sid"); // ???
  console.log("userCookie", userCookie);

  return (
    <div>
      <h2>logo</h2>
      {!userCookie ? (
        <>
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
        </>
      ) : (
        <ApolloConsumer>
          {client => (
            <button onClick={() => handleClick(null, client)}>Logout</button>
          )}
        </ApolloConsumer>
      )}
    </div>
  );
};

export default Navbar;
