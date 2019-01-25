import { ApolloClient } from "apollo-client";
import _ from "lodash";
import React, { Component } from "react";
import { MutationFn, OperationVariables } from "react-apollo";

import "./signupAndLogin.css";

import { LOGIN } from "../../queries";
import { encryptReqData } from "../utils";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { ILoginState, ISignupAndLoginProps, ISignupState } from "./types.d";

/**
 * The root of the `SignupAndLogin` form. Contains the logic to
 * manage the react state / submit the form.
 */
export default class SignupAndLogin extends Component<
  ISignupAndLoginProps,
  ISignupState
> {
  // `Signup` form is displayed by default.
  public static defaultProps: ISignupAndLoginProps = {
    formType: "Signup"
  };

  // preserve the initial state in a new object
  private baseState: ISignupState = {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: "",
    username: ""
  };

  constructor(props: ISignupAndLoginProps) {
    super(props);
    this.state = _.cloneDeep(this.baseState);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return this.props.formType === "Signup" ? (
      <SignupForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        user={this.state}
      />
    ) : (
      <LoginForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        user={this.state}
      />
    );
  }

  public componentWillReceiveProps(nextProps: ISignupAndLoginProps) {
    if (this.props.formType !== nextProps.formType) {
      this.setState(this.baseState);
    }
  }

  /**
   * Updates the react state with a given input and a given value.
   */
  private handleChange(value: string, key: keyof ISignupState): void {
    this.setState({ [key]: value } as Pick<ISignupState, keyof ISignupState>);
  }

  /**
   * Either logs-in a user or signs-up a new user, depending on the
   * given props to this component; either `Signup` or `Login`.
   */
  private handleSubmit(
    signup?: MutationFn<OperationVariables>,
    client?: ApolloClient<any>
  ): void {
    // * during login, `this.state.username` is either
    // * email or username
    const newUser: ILoginState = {
      password: this.state.password,
      username: this.state.username
    };
    if (this.props.formType === "Signup") {
      newUser.email = this.state.email;
    }

    if (signup) {
      signup({
        variables: encryptReqData(newUser)
      })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    } else {
      client
        .query({
          query: LOGIN,
          variables: encryptReqData(newUser)
        })
        .then(data => console.log(data))
        .then(() => client.resetStore())
        .catch(error => console.error(error));
    }

    // ! since fields arent controlled, they arent being cleared
    this.setState(this.baseState);
  }
}

/**
 * ! ---CONTROL FLOW---
 *
 * * signup:
 *    - new user fills out form and submits
 *      - before submission:
 *         + equality of fields' and confirm fields' values
 *           are checked
 *         + length is checked for all fields
 *         + complexity of password is checked
 *      - after submission:
 *         + uniqueness of email and username is checked
 *           ! FAIL: user email/username in use --- try again
 *         + user is logged in on backend
 *         + user is directed to form to fill out account info
 *           * account placed in limited state until completion
 *
 * * login:
 *    - user fills out form and submits:
 *       - success:
 *         + user is directed to home page
 *       - fail:
 *         + user is told that either email or password invalid
 *
 */
