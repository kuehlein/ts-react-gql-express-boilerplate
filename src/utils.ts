/**
 * Validates whether or not an input string is
 * a valid email.
 */
export const isEmail = (str: string) =>
  str.search(
    // tslint:disable-next-line:max-line-length
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ) !== -1;
