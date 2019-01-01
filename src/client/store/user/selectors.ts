import { createSelector } from "reselect";

import { IUserState } from "./reducer";

// ! export + mapStateToProps

export const getLoginData = (state: IUserState) => ({
  email: state.signupAndLogin.email,
  password: state.signupAndLogin.password,
  username: state.signupAndLogin.username
});

export const isSameEmail = (state: IUserState) =>
  state.signupAndLogin.email === state.signupAndLogin.confirmEmail;

export const isSamePassword = (state: IUserState) =>
  state.signupAndLogin.password === state.signupAndLogin.confirmPassword;

export const bothConfirmed = createSelector(
  isSameEmail,
  isSamePassword,
  (checkEmails, checkPasswords) => {
    const errors = [];

    if (!checkEmails) errors.push("Not same email");
    if (!checkPasswords) errors.push("Not same password");

    return errors;
  }
);
