import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
// import { ApolloLink } from "apollo-link"; // ! not really sure what is going on here
import { createHttpLink } from "apollo-link-http";
import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { ReactCookieProps, withCookies } from "react-cookie";
import { Provider } from "react-redux";

import { LOGOUT } from "../../queries";
import rootStore from "../../store";
import "./app.css";

// import Routes from './routes'

import { Navbar, SignupAndLogin } from "../";
import { ISignupAndLoginProps } from "../SignupAndLogin/types";

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

interface IAppProps extends ReactCookieProps {}

interface IAppState extends ISignupAndLoginProps {
  cookies: string;
}

/**
 * This is the main component of the React app. This component is exported to `client/index.tsx`
 * with React Hot Loader to enable HMR with Webpack, and then rendered in `#app`.
 * The `Provider` for the Redux store, the `Provider` for the GraphQL Client,
 * and the React Router `routes` are applied to the app here.
 */
class App extends Component<IAppProps, IAppState> {
  /**
   * The instance of the GraphQL Apollo Client.
   */
  private gqlClient = new ApolloClient({
    cache: new InMemoryCache({ dataIdFromObject: object => object.id || null }),
    link: createHttpLink({
      credentials: "include",
      includeExtensions: true,
      uri: "/graphql",
      useGETForQueries: true
    })
  });

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      cookies: (this.props && this.props.cookies.get("connect.sid")) || "",
      formType: "Signup"
    };
    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    console.log("in props", this.props.cookies);
    console.log("in state", this.state.cookies);

    return (
      <Provider store={rootStore}>
        <ApolloProvider client={this.gqlClient}>
          <div>
            <Navbar
              formType={this.state.formType}
              handleClick={this.handleClick}
              userCookie={this.state.cookies}
            />
            <hr />
            <SignupAndLogin formType={this.state.formType} />
          </div>
        </ApolloProvider>
      </Provider>
    );
  }

  public handleClick(type?: IAppState["formType"], client?: ApolloClient<any>) {
    if (this.state.formType !== type) {
      this.setState({ formType: type });
    }
    // ! else if ???
    if (client) {
      client
        .query({ query: LOGOUT })
        .then((data: any) => console.log(data))
        .then(() => this.props.cookies.remove("connect.sid"))
        .then(() => client.resetStore())
        .catch((error: any) => console.error(error));
    }
  }
}

export default withCookies(App);
