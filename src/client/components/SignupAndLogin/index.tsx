import React, { Component } from "react";

import FormInput from "./FormInput";

interface ISignupAndLoginProps {
  formType: "signup" | "login";
}

export interface ISignupAndLoginState {
  email: string;
  password: string;
}

export interface IUpdateStateArg {
  key: keyof ISignupAndLoginState;
  value: string;
}

export default class SignupAndLogin extends Component<
  ISignupAndLoginProps,
  ISignupAndLoginState
> {
  public static defaultProps = {
    formType: "signup"
  };

  private static signupFields: Array<keyof ISignupAndLoginState> = [
    "email",
    "password"
  ];

  private static loginFields: Array<keyof ISignupAndLoginState> = [
    "email",
    "password"
  ];

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  public mapInputs(formType: ISignupAndLoginProps["formType"]): JSX.Element[] {
    const { signupFields, loginFields } = SignupAndLogin;
    const fields = formType === "signup" ? signupFields : loginFields;

    return fields.map((input, i) => (
      <FormInput
        content={this.state[input]}
        handleChange={this.handleChange}
        key={i}
        placeholder={input}
      />
    ));
  }

  public render() {
    const { formType } = this.props;
    return (
      <form>
        <label>{formType}</label>
        <hr />
        {this.mapInputs(formType)}
      </form>
    );
  }

  private handleChange({ key, value }: IUpdateStateArg): void {
    this.setState({ [key]: value } as Pick<
      ISignupAndLoginState,
      keyof ISignupAndLoginState
    >);
  }
}
