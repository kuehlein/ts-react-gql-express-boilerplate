import React from "react";
import ReactDOM from "react-dom";
// import { AppContainer as HotContainer } from "react-hot-loader"; // ???

import { App } from "./components";

ReactDOM.render(<App />, document.getElementById("app"));

// enables Hot Module Replacement (HMR)
// if ((module as any).hot) {
//   (module as any).hot.accept("./components/App", () => {
//     // for HMR to work, `App` must be re-required
//     const NextApp = require("./components/App").default;
//     ReactDOM.render(<NextApp />, document.getElementById("app"));
//   });
// }
