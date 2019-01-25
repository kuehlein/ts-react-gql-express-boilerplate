/**
 * Validates whether or not an input string is
 * a valid email.
 */
export const isValid = {
  email: (str: string): boolean =>
    str.search(
      // tslint:disable-next-line:max-line-length
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) !== -1,
  password: (str: string): boolean =>
    str.search(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/) !== -1,
  username: (str: string): boolean =>
    str.search(/^(?=[a-zA-Z])[-\w.]{3,15}([a-zA-Z\d]|(?<![-.])_)$/) !== -1
};
