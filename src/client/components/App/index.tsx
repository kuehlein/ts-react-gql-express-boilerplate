import React, { Component } from "react";
import { hot } from "react-hot-loader";
// import { Provider } from "react-redux";

import "./app.css";

// import Routes from './routes'
// import store from "../store";

import { SignupAndLogin } from "../";

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

interface IState {
  isSignup: boolean;
}

class App extends Component<{}, IState> {
  constructor(props) {
    super(props);
    this.state = {
      isSignup: true
    };
  }

  public render() {
    return (
      <>
        <SignupAndLogin formType={this.state.isSignup ? "signup" : "login"} />
        <button
          onClick={() => this.setState({ isSignup: !this.state.isSignup })}
        >
          {this.state.isSignup ? "Login" : "Signup"}
        </button>
      </>
    );
  }
}

export default hot(module)(App);
