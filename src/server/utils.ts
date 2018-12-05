import chalk from "chalk";

/**
 * Formats and colors logs to the console given a `status` ("log" | "warn" | "error")
 * and any number of strings you may wish to pass. NOTE: you can style the input strings (using
 * a library like `chalk`) that you pass in for furthur customization.
 */
export const prettyLogger = (
  status: "log" | "warn" | "error",
  ...text: string[]
): void => {
  const indent: string = "              ";
  const designs: {} = {
    error: chalk.reset.redBright(
      "\n#########################################################"
    ),
    log: chalk.reset.cyanBright(
      "\n`·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·´"
    ),
    warn: chalk.reset.yellowBright(
      "\n*********************************************************"
    )
  };
  const colors: {} = {
    error: "redBright",
    log: "cyanBright",
    warn: "yellow"
  };
  const styledText: string[] = text.map(sentence =>
    chalk.bold[colors[status]]("\n" + indent + sentence)
  );

  console[status](designs[status]);
  console[status](...styledText);
  console[status](designs[status] + "\n");
};

/**
 * Given a `condition`, throw an error if `true` using the given `fail` message, and if
 * `false` return the optional `success` argument, or `undefined` if no success is provided.
 */
export const throwIfError = (
  condition: boolean,
  fail: string,
  success?: any
): any => {
  if (condition) throw new Error(fail);
  return success;
};
