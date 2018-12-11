import React, { Component } from "react";

import FormInput from "./FormInput";

interface ISignupAndLoginProps {
  formType: "signup" | "login";
}

export interface ISignupState {
  birthday: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
}

export interface ILoginState {
  email: string;
  password: string;
}

export default class SignupAndLogin extends Component<
  ISignupAndLoginProps,
  ISignupState | ILoginState
> {
  public static defaultProps = {
    formType: "signup"
  };

  private signupState: ISignupState = {
    birthday: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: ""
  };

  private loginState: ILoginState = {
    email: "",
    password: ""
  };

  constructor(props) {
    super(props);
    this.state =
      this.props.formType === "signup" ? this.signupState : this.loginState;
    this.handleChange = this.handleChange.bind(this);
  }

  public mapInputs(): JSX.Element[] {
    // ! the order will be inconsistent... use an array?
    return Object.keys(this.state).map(key => (
      <FormInput
        content={this.state[key]}
        handleChange={this.handleChange}
        key={key}
        placeholder={key as keyof ISignupState | keyof ILoginState}
      />
    ));
  }

  public render() {
    return (
      <form>
        <label>{this.props.formType}</label>
        <hr />
        {this.mapInputs()}
      </form>
    );
  }

  private handleChange(
    placeholder: keyof ISignupState | keyof ILoginState,
    value: string
  ): void {
    this.setState({ [placeholder]: value } as
      | Pick<ISignupState, keyof ISignupState>
      | Pick<ILoginState, keyof ILoginState>);
  }
}
