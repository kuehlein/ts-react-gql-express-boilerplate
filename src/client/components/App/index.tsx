import ApolloClient from "apollo-client";
import React, { Component } from "react";
import { Cookies, withCookies } from "react-cookie";
import { RouteComponentProps, withRouter } from "react-router-dom";

import "./app.css";

import { LOGOUT } from "../../queries";
import Footer from "./Footer";
import Main from "./Main";
import Navbar from "./Navbar";
import Routes from "./Routes";

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

interface IAppProps extends RouteComponentProps {
  cookies?: Cookies;
}

interface IAppState {
  userCookie: Cookies;
}

/**
 * Main component...
 */
class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    const { cookies } = this.props;

    this.state = {
      userCookie: cookies.get("connect.sid") || ""
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  public render() {
    const { userCookie } = this.state;

    return (
      <>
        <Navbar handleLogout={this.handleLogout} userCookie={userCookie} />
        <hr />
        <Main>
          <Routes userCookie={userCookie} />
        </Main>
        <Footer />
      </>
    );
  }

  public handleLogout(client?: ApolloClient<any>) {
    client
      .query({ query: LOGOUT })
      .then((data: any) => console.log(data))
      .then(() => this.props.cookies.remove("connect.sid"))
      .then(() => client.resetStore())
      .catch((error: any) => console.error(error));
  }
}

export default withCookies(withRouter(App));
