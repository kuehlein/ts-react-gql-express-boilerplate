import React from "react";
import ReactDOM from "react-dom";
import { AppContainer as HotContainer } from "react-hot-loader"; // ???

import { App } from "./components";

ReactDOM.render(
  <HotContainer>
    <App />
  </HotContainer>,
  document.getElementById("app")
);

// enables Hot Module Replacement (HMR)
if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    // for HMR to work, `App` must be re-required
    const NextApp = require("./components/App").default;
    ReactDOM.render(
      <HotContainer>
        <NextApp />
      </HotContainer>,
      document.getElementById("app")
    );
  });
}
