import React, { Component } from "react";
import { hot } from "react-hot-loader";
// import { Provider } from "react-redux";

import "./app.css";

// import Routes from './routes'
// import store from "../store";

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

class App extends Component {
  public state: { counter: number };

  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  public render() {
    return (
      <div style={{ background: "orange" }}>
        <h3>current count: {this.state.counter}</h3>
        <button
          className="red"
          onClick={() => this.setState({ counter: this.state.counter + 1 })}
        >
          +1
        </button>
      </div>
    );
  }
}

export default hot(module)(App);

/*

interface IMyProps {
  name: string
  age: number
}
const App: SFC<IMyProps> = () => {}

*/
