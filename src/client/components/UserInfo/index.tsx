import React, { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { userActions } from "../../store";
import { RootAction, RootState } from "../../store/types.d";
import {
  ISignupAndLoginConfirmation,
  ISignupAndLoginField
} from "../../store/user/models";
import Inputs from "./Inputs";

interface IParentProps {
  formType: "Signup" | "Login";
}

// ! might have to combine these props...

interface IStateProps {
  // formType?: "Signup" | "Login";
  user: RootState["user"]["signupAndLogin"];
}
const mapStateToProps = (state: RootState): IStateProps => ({
  user: state.user.signupAndLogin
});

interface IDispatchProps {
  handleChange: (
    key: keyof ISignupAndLoginConfirmation,
    value: string
  ) => {
    type: string;
    payload: ISignupAndLoginField;
  };
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>
): IDispatchProps => ({
  handleChange: (key, value) => dispatch(userActions.setLoginField(key, value))
});

type ISignupAndLoginProps = IParentProps & IStateProps & IDispatchProps;

/**
 * THIS IS WHERE THE BOI STARTS
 */
// @connect<StateProps, DispatchProps, and>
// stateProps what ever we mapped from state
// @connect<IStateProps, IDispatchProps, IParentProps>(
//   mapStateToProps,
//   mapDispatchToProps
// )
class UserInfo extends Component<ISignupAndLoginProps> {
  /**
   * `Signup` form is displayed by default.
   */
  // public static defaultProps = {
  //   formType: "Signup"
  // };

  public state: ISignupAndLoginConfirmation;

  constructor(props: ISignupAndLoginProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    const { user, formType, handleChange } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Inputs isSignup={false} handleChange={handleChange} user={user} />
        {formType === "Signup" && (
          <Inputs isSignup={true} handleChange={handleChange} user={user} />
        )}
        <button>{formType}</button>
      </form>
    );
  }

  /**
   * Handles submitting new user / login to backend // ! ------- not done
   */
  private handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log(event);

    // is password === password_validation
    // TODO: send the state with gql
  }
}

export default connect<IStateProps, IDispatchProps, void>(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo);
