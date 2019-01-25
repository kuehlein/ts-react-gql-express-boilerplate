import _ from "lodash";
import React, { SFC } from "react";
import { ApolloConsumer } from "react-apollo";

import { MForm, MInput } from "../Materials";
import { IFormProps, ISignupState } from "./types";

/**
 * Template for `SignupAndLogin` form based on whether the state is
 * currently `Signup` or `Login`.
 */
const LoginForm: SFC<IFormProps> = ({ handleChange, handleSubmit, user }) => {
  const debouncedHandleChange = _.debounce(handleChange, 300);
  const eventHandler = (value: string, key: keyof ISignupState) =>
    debouncedHandleChange(value, key);

  return (
    <ApolloConsumer>
      {client => (
        <MForm
          args={[null, client]}
          // ! better way to tell user of invalid inputs
          disableSubmit={!user.username || !user.password}
          handleSubmit={handleSubmit}
          name="Login"
          redirect="/me"
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <MInput
              args={["username"]}
              handleChange={eventHandler}
              isRequired={true}
              name="username/email" // ! messes up label
              type={"email"}
            />
            <MInput
              args={["password"]}
              handleChange={eventHandler}
              isRequired={true}
              name="password"
              type={"password"}
            />
          </div>
        </MForm>
      )}
    </ApolloConsumer>
  );
};

LoginForm.defaultProps = {
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

export default LoginForm;
