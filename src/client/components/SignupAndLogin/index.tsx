import { ApolloQueryResult } from "apollo-client";
import _ from "lodash";
import React, { Component } from "react";
import {
  ApolloConsumer,
  Mutation,
  MutationFn,
  OperationVariables
} from "react-apollo";

import "./signupAndLogin.css";

import { User } from "../../../server/db";
import { LOGIN, SIGNUP } from "../../queries";
import Form from "./Form";

interface ISignupAndLoginProps {
  formType: "Signup" | "Login";
}

export interface ISignupState {
  confirmEmail: string;
  confirmPassword: string;
  email: string;
  password: string;
  username: string;
}

export interface ILoginState {
  email: string;
  password: string;
  username: string;
}

/**
 * THIS IS WHERE THE BOI STARTS
 */
export default class SignupAndLogin extends Component<
  ISignupAndLoginProps,
  ISignupState | ILoginState
> {
  /**
   * `Signup` form is displayed by default.
   */
  public static defaultProps: ISignupAndLoginProps = {
    formType: "Signup"
  };

  constructor(props: ISignupAndLoginProps) {
    super(props);
    this.state =
      this.props.formType === "Signup"
        ? ({
            confirmEmail: "",
            confirmPassword: "",
            email: "",
            password: "",
            username: ""
          } as Readonly<ISignupState>)
        : ({
            email: "",
            password: "",
            username: ""
          } as Readonly<ILoginState>);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    const { formType } = this.props;

    return formType === "Signup" ? (
      <Mutation mutation={SIGNUP}>
        {(signup, { data }) => (
          <form
            onSubmit={() => {
              event.preventDefault();
              this.handleSubmit(signup);
            }}
          >
            <Form
              formType="Signup"
              handleChange={this.handleChange}
              user={this.state}
            />
          </form>
        )}
      </Mutation>
    ) : (
      <ApolloConsumer>
        {client => (
          <form
            onSubmit={() => {
              event.preventDefault();
              this.handleSubmit(null, client.query);
            }}
          >
            <Form
              formType="Login"
              handleChange={this.handleChange}
              user={this.state}
            />
          </form>
        )}
      </ApolloConsumer>
    );
  }

  private handleChange(
    key: keyof ILoginState | keyof ISignupState,
    value: string
  ): void {
    this.setState({ [key]: value } as
      | Pick<ISignupState, keyof ISignupState>
      | Pick<ILoginState, keyof ILoginState>);

    // debounce validation
  }

  /**
   * Handles submitting new user / login to backend
   */
  private handleSubmit(
    // ! formerly: MutationFn<any, OperationVariables>
    signup?: MutationFn<OperationVariables>,
    login?: ({}) => Promise<ApolloQueryResult<User["id"]>>
  ): void {
    const newUser = {
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
