import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
// import { ApolloLink } from "apollo-link"; // ! not really sure what is going on here
import { HttpLink } from "apollo-link-http";
import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";

import rootStore from "../../store";
import "./app.css";

// import Routes from './routes'

import { SignupAndLogin, UserInfo } from "../";

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

interface IState {
  isSignup: boolean;
}

/**
 * This is the main component of the React app. This component is exported to `client/index.tsx`
 * with React Hot Loader to enable HMR with Webpack, and then rendered in `#app`.
 * The `Provider` for the Redux store, the `Provider` for the GraphQL Client,
 * and the React Router `routes` are applied to the app here.
 */
class App extends Component<{}, IState> {
  /**
   * The instance of the GraphQL Apollo Client.
   */
  private gqlClient = new ApolloClient({
    cache: new InMemoryCache({ dataIdFromObject: object => object.id || null }),
    link: new HttpLink({
      includeExtensions: true,
      useGETForQueries: true // ! ???
    })
  });

  constructor(props: {}) {
    super(props);
    this.state = {
      isSignup: true
    };
  }

  public render() {
    return (
      <Provider store={rootStore}>
        <ApolloProvider client={this.gqlClient}>
          <div>
            <button
              onClick={() => this.setState({ isSignup: !this.state.isSignup })}
            >
              {this.state.isSignup ? "Login" : "Signup"}
            </button>
            <hr />
            <SignupAndLogin
              formType={this.state.isSignup ? "Signup" : "Login"}
            />
          </div>
          {/* <UserInfo formType={this.state.isSignup ? "Signup" : "Login"} /> */}
        </ApolloProvider>
      </Provider>
    );
  }
}

export default hot(module)(App);
