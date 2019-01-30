import React, { Component } from "react";
import { hot } from "react-hot-loader";

/**
 * Landing page...
 */
class Landing extends Component<{}, { count: number }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div style={{ backgroundColor: "red" }}>
        <h2>Landing page</h2>
        <h3>{this.state.count}</h3>
        <hr />
        <hr />
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          + 1
        </button>
      </div>
    );
  }
}

export default hot(module)(Landing);
