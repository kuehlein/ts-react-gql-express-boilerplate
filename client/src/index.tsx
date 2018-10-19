import React from "react";
import ReactDOM from "react-dom";

import { App } from "./components";

declare let module: any;

ReactDOM.render(<App />, document.getElementById("app"));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;

    ReactDOM.render(<NextApp />, document.getElementById("app"));
  });
}
