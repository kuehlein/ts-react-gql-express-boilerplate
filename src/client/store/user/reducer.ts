import { cloneDeep } from "lodash";
import { combineReducers } from "redux";
import { ActionType } from "typesafe-actions";

import * as actions from "./actions";
import { SET_FIELD } from "./constants";
import { ISignupAndLoginConfirmation } from "./models";

/**
 * INITIAL STATE
 */
const defaultUser: ISignupAndLoginConfirmation = {
  confirmEmail: "",
  confirmPassword: "",
  email: "",
  password: "",
  username: ""
};

export interface IUserState {
  readonly signupAndLogin: ISignupAndLoginConfirmation;
}

export type IUserAction = ActionType<typeof actions>;

/**
 * REDUCER
 */
// ! only combine reducers because planning on adding more reducers...
export default combineReducers<IUserState, IUserAction>({
  signupAndLogin: (state = defaultUser, action) => {
    switch (action.type) {
      case SET_FIELD:
        const newState = cloneDeep(state);
        newState[action.payload.key] = action.payload.value;
        return newState;

      default:
        return state;
    }
  }
});
