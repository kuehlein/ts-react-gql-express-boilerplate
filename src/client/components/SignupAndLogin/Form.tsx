import React, { SFC } from "react";

import FormInput from "./FormInput";
import { ILoginState, ISignupState } from "./index";

interface IFormProps {
  formType: "Signup" | "Login";
  handleChange: (
    key: keyof ISignupState | keyof ILoginState,
    value: string
  ) => void;
  user: ISignupState | ILoginState;
}

const Form: SFC<IFormProps> = ({ formType, handleChange, user }) => (
  <>
    {formType}
    <FormInput isConfirm={false} handleChange={handleChange} user={user} />
    {formType === "Signup" && (
      <FormInput isConfirm={true} handleChange={handleChange} user={user} />
    )}
    <button type="Submit">{formType}</button>
  </>
);

Form.defaultProps = {
  formType: "Signup",
  handleChange: () => {},
  user: {
    confirmEmail: "",
    confirmPassword: "",
    email: "",
    password: "",
    username: ""
  }
};

export default Form;
