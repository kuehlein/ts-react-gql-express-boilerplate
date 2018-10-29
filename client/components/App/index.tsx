import React, { SFC } from "react";
// import { Provider } from "react-redux";

// import "!app!css!./app.css"; // ts-loader stuff // ! ???

// import Routes from './routes'
// import store from "../store";

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

const App: SFC = () => (
  // <Provider store={store}>
  // <Routes />
  <div style={{ background: "cyan" }}>
    <h3>yoooooo</h3>
    <h3>yoooooo</h3>
  </div>
  // </Provider>
);

export default App;

/*

interface IMyProps {
  name: string
  age: number
}
const App: SFC<IMyProps> = () => {}

*/
