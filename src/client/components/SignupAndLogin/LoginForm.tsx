import { ApolloClient } from "apollo-client";
import _ from "lodash";
import React, { SFC } from "react";
import { ApolloConsumer, MutationFn, OperationVariables } from "react-apollo";

import { Form } from "../Materials";
import FormInputs from "./FormInputs";
import { ISignupState } from "./types";

/**
 * Props recievied from `SignupAndLogin`, and passed down to input components.
 */
interface IFormProps {
  handleChange: (key: keyof ISignupState, value: string) => void;
  handleSubmit: (
    signup?: MutationFn<OperationVariables>,
    client?: ApolloClient<any>
  ) => void;
  user: ISignupState;
}

/**
 * Template for `SignupAndLogin` form based on whether the state is
 * currently `Signup` or `Login`.
 */
const LoginForm: SFC<IFormProps> = ({ handleChange, handleSubmit, user }) => {
  const debouncedHandleChange = _.debounce(handleChange, 300);
  const eventHandler = (key: keyof ISignupState, value: string) =>
    debouncedHandleChange(key, value);

  return (
    <ApolloConsumer>
      {client => (
        <Form
          args={[null, client]}
          handleSubmit={handleSubmit}
          name="Login"
          redirect="/me"
        >
          <div style={{ display: "flex" }}>
            <FormInputs
              formType={"Login"}
              handleChange={eventHandler}
              user={user}
            />
          </div>
        </Form>
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
