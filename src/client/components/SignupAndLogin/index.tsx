import { ApolloQueryResult } from "apollo-client";
import _ from "lodash";
import React, { Component } from "react";
import { MutationFn, OperationVariables } from "react-apollo";

import "./signupAndLogin.css";

import { User } from "../../../server/db";
import { LOGIN, SIGNUP } from "../../queries";
import Form from "./Form";
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
    return (
      <Form
        formType={this.props.formType}
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
  private handleChange(key: keyof ISignupState, value: string): void {
    this.setState({ [key]: value } as Pick<ISignupState, keyof ISignupState>);
  }

  /**
   * Either logs-in a user or signs-up a new user, depending on the
   * given props to this component; either `Signup` or `Login`.
   */
  private handleSubmit(
    signup?: MutationFn<OperationVariables>,
    login?: ({}) => Promise<ApolloQueryResult<User["id"]>>
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
        variables: newUser
      })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    } else {
      login({
        query: LOGIN,
        variables: newUser
      })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }

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
