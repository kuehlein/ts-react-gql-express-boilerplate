import ApolloClient from "apollo-client";
import React, { SFC } from "react";
import { ApolloConsumer } from "react-apollo";
import { Cookies } from "react-cookie";
import { Link } from "react-router-dom";

import { Button } from "../Materials";

interface INavbarProps {
  userCookie: Cookies;
  handleLogout: (client?: ApolloClient<any>) => void;
}

/**
 * Navbar...
 */
const Navbar: SFC<INavbarProps> = ({ handleLogout, userCookie }) => {
  return (
    <>
      <h2>
        <Link to="/">logo</Link>
      </h2>
      {!userCookie ? (
        <>
          <Button
            // disabled={formType === "Signup"}
            name="Signup"
            redirect="signup"
          />
          <Button
            // disabled={formType === "Login"}
            name="Login"
            redirect="login"
          />
        </>
      ) : (
        <ApolloConsumer>
          {client => (
            <Button
              args={[client]}
              handleClick={handleLogout}
              name="Logout"
              redirect="/"
            />
          )}
        </ApolloConsumer>
      )}
    </>
  );
};

export default Navbar;
