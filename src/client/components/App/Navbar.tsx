import ApolloClient from "apollo-client";
import React, { SFC } from "react";
import { ApolloConsumer } from "react-apollo";
import { Cookies } from "react-cookie";
import { Link } from "react-router-dom";

import { MButton } from "../Materials";

interface INavbarProps {
  userCookie: Cookies;
  handleLogout: (client?: ApolloClient<any>) => void;
}

/**
 * Navbar...
 */
const Navbar: SFC<INavbarProps> = ({ handleLogout, userCookie }) => (
  <>
    <h2>
      <Link to="/">logo</Link>
    </h2>
    {!userCookie ? (
      <>
        <MButton
          disabled={window.location.pathname === "/signup"}
          name="Signup"
          redirect="signup"
        />
        <MButton
          disabled={window.location.pathname === "/login"}
          name="Login"
          redirect="login"
        />
      </>
    ) : (
      <ApolloConsumer>
        {client => (
          <MButton
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

export default Navbar;
