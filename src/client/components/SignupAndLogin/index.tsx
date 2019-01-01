import _ from "lodash";
import React, { Component, FormEvent } from "react";
import { graphql } from "react-apollo";

import "./signupAndLogin.css";

import { login, signup } from "../../queries";
import FormInput from "./FormInput";

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

    return (
      <form onSubmit={this.handleSubmit} style={{ display: "flex" }}>
        {formType}
        <FormInput
          isConfirm={false}
          handleChange={this.handleChange}
          user={this.state}
        />
        {formType === "Signup" && (
          <FormInput
            isConfirm={true}
            handleChange={this.handleChange}
            user={this.state}
          />
        )}
        <button>{formType}</button>
      </form>
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
  private handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const { email, password, username } = this.state;

    // ! check for Signup or Login?
    this.props
      .mutate({
        variables: {
          email,
          password,
          username
        }
      })
      .catch((err: any) => console.log(err));
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
