import React, { SFC } from "react";
import { Cookies } from "react-cookie";
import { Route, Switch } from "react-router-dom";

import { Dashboard, Landing, SignupAndLogin } from "../";

interface IRouteProps {
  userCookie: Cookies;
}

/**
 * Routes...
 */
const Routes: SFC<IRouteProps> = ({ userCookie }) => (
  <Switch>
    {/* Routes placed here are available to all visitors */}
    <Route exact={true} path="/" component={Landing} />
    {userCookie && (
      <Switch>
        {/* Routes placed here are only available after logging in */}
        <Route path="/me" component={Dashboard} />
      </Switch>
    )}
    {/* Displays our Login component as a fallback */}
    <Route path="/signup" render={() => <SignupAndLogin formType="Signup" />} />
    <Route path="/login" render={() => <SignupAndLogin formType="Login" />} />
  </Switch>
);

export default Routes;
