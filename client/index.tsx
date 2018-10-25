/**
 * ! This module is an entry point !
 *   * Modify the webpack.config + package.json to make adjustments
 *   * to the locations of the entrypoints in this project.
 *
 *   * Be careful when modifying this module.
 */

import React from "react";
import ReactDOM from "react-dom";

import { App } from "./components";

declare let module: any;

ReactDOM.render(<App />, document.getElementById("app"));

// Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept("./components/App", () => {
    // for HMR to work, `App` must be re-required
    const NextApp = require("./components/App").default;
    ReactDOM.render(<NextApp />, document.getElementById("app"));
  });
}
