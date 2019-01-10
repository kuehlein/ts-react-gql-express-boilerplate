import { ApolloQueryResult } from "apollo-client";
import _ from "lodash";
import React, { Component } from "react";
import { MutationFn, OperationVariables } from "react-apollo";

import "./signupAndLogin.css";

import { User } from "../../../server/db";
import { LOGIN } from "../../queries";
import Form from "./Form";

interface ISignupAndLoginProps {
  formType: "Signup" | "Login";
}

export interface IConfirmFields {
  confirmEmail: string;
  confirmPassword: string;
}

export interface ILoginState {
  email: string;
  password: string;
  username: string;
}

export type ISignupState = ILoginState & IConfirmFields;

/**
 * THIS IS WHERE THE BOI STARTS
 */
export default class SignupAndLogin extends Component<
  ISignupAndLoginProps,
  ISignupState
> {
  /**
   * `Signup` form is displayed by default.
   */
  public static defaultProps: ISignupAndLoginProps = {
    formType: "Signup"
  };

  constructor(props: ISignupAndLoginProps) {
    super(props);
    // ! same state is being used no matter what---
    this.state = {
      confirmEmail: "",
      confirmPassword: "",
      email: "",
      password: "",
      username: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    console.log(this.state);
    return (
      <Form
        formType={this.props.formType}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        user={this.state}
      />
    );
  }

  private handleChange(key: keyof ISignupState, value: string): void {
    console.log("WHYYYY");
    this.setState({ [key]: value } as Pick<ISignupState, keyof ISignupState>);
  }

  /**
   * Handles submitting new user / login to backend
   */
  private handleSubmit(
    signup?: MutationFn<OperationVariables>,
    login?: ({}) => Promise<ApolloQueryResult<User["id"]>>
  ): void {
    const newUser: ILoginState = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username
    };

    if (signup) signup({ variables: newUser });
    else {
      login({
        query: LOGIN,
        variables: newUser
      });
    }

    // .query<T, TVariables>

    // ! clear local state
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
