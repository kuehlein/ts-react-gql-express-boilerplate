import React, { SFC } from "react";
import { ISignupAndLoginConfirmation } from "../../store/user/models";

interface IFormInputsProps {
  handleChange: (key: keyof ISignupAndLoginConfirmation, value: string) => void;
  isSignup: boolean;
  user: ISignupAndLoginConfirmation;
}

const Inputs: SFC<IFormInputsProps> = ({ handleChange, isSignup, user }) => {
  const shouldConfirm = isSignup ? "Confirm " : "";

  return (
    <>
      {!isSignup && (
        <label htmlFor="input">
          {shouldConfirm}Username
          <input
            onChange={e => handleChange("username", e.target.value)}
            placeholder="username"
            value={user.username}
            min={4}
            max={16}
            required
            type="text"
            // pattern={//}
            // title={"you dingus, why you no choose goood usernamej"}
          />
        </label>
      )}
      <label htmlFor="input">
        {shouldConfirm}Email
        <input
          onChange={e => handleChange("email", e.target.value)}
          placeholder={"email"}
          value={isSignup ? user.confirmEmail : user.email}
        />
      </label>
      <label htmlFor="input">
        {shouldConfirm}Password
        <input
          onChange={e => handleChange("password", e.target.value)}
          placeholder={"password"}
          value={isSignup ? user.confirmPassword : user.password}
        />
      </label>
    </>
  );
};

export default Inputs;
