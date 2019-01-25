import debounce from "lodash/debounce";
import React, { SFC } from "react";
import { Mutation } from "react-apollo";

import { isValid } from "../../../utils";
import { SIGNUP } from "../../queries";
import { MForm, MInput } from "../Materials";
import { IFormProps, ISignupState } from "./types";
import { isFormValid } from "./utils";

/**
 * Template for `SignupAndLogin` form based on whether the state is
 * currently `Signup` or `Login`.
 */
const SignupForm: SFC<IFormProps> = ({ handleChange, handleSubmit, user }) => {
  const debouncedHandleChange = debounce(handleChange, 300);
  const eventHandler = (value: string, key: keyof ISignupState) =>
    debouncedHandleChange(value, key);

  return (
    <Mutation mutation={SIGNUP}>
      {(signup, { loading, error }) => (
        <>
          <MForm
            args={[signup]}
            disableSubmit={!isFormValid(user)}
            handleSubmit={handleSubmit}
            name="Signup"
            redirect="/me"
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <MInput
                  args={["username"]}
                  handleChange={eventHandler}
                  isRequired={true}
                  name="username"
                  style={
                    isValid.username(user.username) || !user.username
                      ? "std"
                      : "invalid"
                  }
                  type={"text"}
                />
                <MInput
                  args={["email"]}
                  handleChange={eventHandler}
                  isRequired={true}
                  name="email"
                  style={
                    isValid.email(user.email) || !user.email ? "std" : "invalid"
                  }
                  type={"email"}
                />
                <MInput
                  args={["password"]}
                  handleChange={eventHandler}
                  isRequired={true}
                  name="password"
                  style={
                    isValid.password(user.password) || !user.password
                      ? "std"
                      : "invalid"
                  }
                  type={"password"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <MInput
                  args={["confirmEmail"]}
                  handleChange={eventHandler}
                  isRequired={true}
                  name="confirmEmail"
                  style={user.email === user.confirmEmail ? "std" : "invalid"}
                  type={"email"}
                />
                <MInput
                  args={["confirmPassword"]}
                  handleChange={eventHandler}
                  isRequired={true}
                  name="confirmPassword" // ! password
                  style={
                    user.password === user.confirmPassword ? "std" : "invalid"
                  }
                  type={"password"}
                />
              </div>
            </div>
          </MForm>
          {loading && <p>Loading...</p>}
          {error && <p>Error :( Please try again</p>}
        </>
      )}
    </Mutation>
  );
};

SignupForm.defaultProps = {
  handleChange: () => {},
  handleSubmit: () => {},
  user: {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: "",
    username: ""
  }
};

export default SignupForm;
