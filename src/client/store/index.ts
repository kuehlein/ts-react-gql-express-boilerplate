import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";

import { userReducer } from "./user";

export const rootReducer = combineReducers({
  user: userReducer
});

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger) // ({ collapsed: true })),
);

const rootStore = createStore(rootReducer, middleware);

export default rootStore;
// export * from "./types.d";
export * from "./user";
