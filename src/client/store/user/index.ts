import * as userActions from "./actions";
import * as userConstants from "./constants";
import userReducer, { IUserAction, IUserState } from "./reducer";
import * as userSelectors from "./selectors";
export {
  userActions,
  userConstants,
  userReducer,
  IUserAction,
  IUserState,
  userSelectors
};

// import axios from "axios";

// import history from "../../history";

// /**
//  * IUserAction TYPE
//  */
// interface IUserAction {
//   type: string;
//   user: string;
// }

// /**
//  * ACTION TYPES
//  */
// const GET_USER = "GET_USER";
// const REMOVE_USER = "REMOVE_USER";

// /**
//  * INITIAL STATE
//  */
// const defaultUser = {};

// /**
//  * ACTION CREATORS
//  */
// type getUser = (user: object) => object;
// const getUser = user => ({ type: GET_USER, user });

// type removeUser = () => object;
// const removeUser = () => ({ type: REMOVE_USER });

// /**
//  * THUNK CREATORS
//  */
// export const me = () => dispatch =>
//   axios
//     .get("/auth/me")
//     .then(res => dispatch(getUser(res.data || defaultUser)))
//     .catch(err => console.log(err));

// export const auth = (
//   email: string,
//   password: string,
//   method: string
// ) => dispatch =>
//   axios
//     .post(`/auth/${method}`, { email, password }) // ! patch
//     .then(
//       res => {
//         dispatch(getUser(res.data));
//         history.push("/home");
//       },
//       authError => {
//         // rare example: a good use case for parallel (non-catch) error handler
//         dispatch(getUser({ error: authError }));
//       }
//     )
//     .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr));

// export const logout = () => dispatch =>
//   axios
//     .post("/auth/logout") // ! patch
//     .then(_ => {
//       dispatch(removeUser());
//       history.push("/login");
//     })
//     .catch(err => console.log(err));

// /**
//  * REDUCER
//  */
// export default function(state = defaultUser, action: IUserAction) {
//   switch (action.type) {
//     case GET_USER:
//       return action.user;
//     case REMOVE_USER:
//       return defaultUser;
//     default:
//       return state;
//   }
// }
