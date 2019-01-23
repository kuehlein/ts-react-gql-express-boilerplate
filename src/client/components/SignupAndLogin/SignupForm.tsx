import { ApolloClient } from "apollo-client";
import _ from "lodash";
import React, { SFC } from "react";
import { Mutation, MutationFn, OperationVariables } from "react-apollo";
import { Link } from "react-router-dom";

import { SIGNUP } from "../../queries";
import { Form } from "../Materials";
import ConfirmInputs from "./ConfirmInputs";
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
const SignupForm: SFC<IFormProps> = ({ handleChange, handleSubmit, user }) => {
  const debouncedHandleChange = _.debounce(handleChange, 300);
  const eventHandler = (key: keyof ISignupState, value: string) =>
    debouncedHandleChange(key, value);

  return (
    <Mutation mutation={SIGNUP}>
      {(signup, { loading, error }) => (
        <>
          <Form
            args={[signup]}
            handleSubmit={handleSubmit}
            name="Signup"
            redirect="/me"
          >
            <div style={{ display: "flex" }}>
              <FormInputs
                formType={"Signup"}
                handleChange={eventHandler}
                user={user}
              />
              <ConfirmInputs handleChange={eventHandler} user={user} />
            </div>
          </Form>
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
