import { ApolloQueryResult } from "apollo-client";
import _ from "lodash";
import React, { SFC } from "react";
import {
  ApolloConsumer,
  Mutation,
  MutationFn,
  OperationVariables
} from "react-apollo";

import { User } from "../../../server/db";
import { SIGNUP } from "../../queries";
import ConfirmInputs from "./ConfirmInputs";
import FormInputs from "./FormInputs";
import { ISignupState } from "./index";

// ApolloConsumer: React.FunctionComponent<ApolloConsumerProps>
interface IFormProps {
  formType: "Signup" | "Login";
  handleChange: (key: keyof ISignupState, value: string) => void;
  handleSubmit: (
    signup?: MutationFn<OperationVariables>,
    login?: ({}) => Promise<ApolloQueryResult<User["id"]>>
  ) => void;
  user: ISignupState;
}

// chooses query or mutation
const Form: SFC<IFormProps> = ({
  formType,
  handleChange,
  handleSubmit,
  user
}) => {
  const debouncedHandleChange = _.debounce(handleChange, 300);
  const eventHandler = (key: keyof ISignupState, value: string) =>
    debouncedHandleChange(key, value);

  return formType === "Signup" ? (
    <Mutation mutation={SIGNUP}>
      {signup => (
        <form
          onSubmit={() => {
            event.preventDefault();
            handleSubmit(signup);
          }}
        >
          <h2>{formType}</h2>
          <div style={{ display: "flex" }}>
            <FormInputs handleChange={eventHandler} user={user} />
            <ConfirmInputs handleChange={eventHandler} user={user} />
          </div>
          <button type="Submit">{formType}</button>
        </form>
      )}
    </Mutation>
  ) : (
    <ApolloConsumer>
      {client => (
        <form
          onSubmit={() => {
            event.preventDefault();
            handleSubmit(null, client.query);
          }}
        >
          <h2>{formType}</h2>
          <div style={{ display: "flex" }}>
            <FormInputs handleChange={handleChange} user={user} />
          </div>
          <button type="Submit">{formType}</button>
        </form>
      )}
    </ApolloConsumer>
  );
};

Form.defaultProps = {
  formType: "Signup",
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

export default Form;
