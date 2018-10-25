import React from "react";
// import { Provider } from "react-redux";

import "!app!css!./app.css"; // ts-loader stuff

// import Routes from './routes'
// import store from "../store";

const App = () =>
  console.log("we are at app...") || (
    // <Provider store={store}>
    //  {/* <Routes /> */}
    <div style={{ background: "red" }}>
      <h3>yoo</h3>
    </div>
    // </Provider>
  );

export default App;
