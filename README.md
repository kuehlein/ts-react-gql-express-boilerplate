boilerplate for typescript react gql express project

should i use a prettier config?

# TODO:

    * user:
           - model
           - user store
    * redux store
    * graphql
    * auth
    * passport

how to start dev.....

-tsc ./webpack.config.ts

-webpack command
-compiles -----> start server -----> build +
-builds
|
-start server
~server _serves_ static bundle build by webpack

**_CHANGES_**

-

# 2 tsconfigs??

    ~one for

---

#CONTROL FLOW
_development and prododuction_

---

TRANSPILE:
-./webpack.config.ts
-./server/index.ts
-./server/server/ts

RUN:
-./public/dist/ts-sourcemap/server/index.js
|
V
-./public/dist/ts-sourcemap/server/server.js
|
V
-./public/dist/ts-sourcemap/webpack.config.js
|
TSC + <----------excecuting webpack.config
BUNDLE
|
V
WAIT ON SERVER <------webpack finishes, server resumes
|
V
SERVER FINISHES <-----server finishes executing
CREATING APP +
SERVES BUNDLE <------server statically serves bundle

---

TRANSPILE:
-./webpack.config.ts
-./server/index.ts
-./server/server/ts

RUN:
-./public/dist/ts-sourcemap/server/index.js
|
V
-./public/dist/ts-sourcemap/server/server.js
|
V
-./public/dist/ts-sourcemap/webpack.config.js
|
TSC + <----------excecuting webpack.config
BUNDLE
|
V
WAIT ON SERVER <------webpack finishes, server resumes
|
V
SERVER FINISHES <-----server finishes executing
CREATING APP +
SERVES BUNDLE <------server statically serves bundle

CHANGES MADE: (client)
-react-hot-loader detects changes ???
-tells webpack to recompile / rebundle changed modules
-swaps out modules in current bundle without affecting state

CHANGES MADE: (server)
-hmr does not work well with something that restarts servers
-changes will not be detected
-will have to restart

# USE NODEMON INSTEAD --- no client side watching :(

/\*\*

- startListening
- _NOTE_ --- This is fancier than it needs to be.
  \*/
  private startListening(): void {
  this.appInstance.listen(this.PORT, () => {
  const indent: string = " ";
  const design: string =
  "`·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·´"; const uri: string =`http://localhost:${this.PORT}`;

      console.log(chalk.magentaBright.bold(`\n${design}\n`));
      console.log(
        chalk.cyanBright(`${indent}Listening on:\n`),
        chalk.reset.green.bold(`${indent + indent}-${uri}\n`),
        chalk.reset.cyanBright(`${indent + indent + indent} AND\n`),
        chalk.reset.green.bold(`${indent + indent}-${uri}\n`) // ! ${gqlServer.graphqlPath}\n`
      );
      console.log(chalk.reset.magentaBright.bold(`${design}\n`));

  });
  }

/\*\*

- startListening
- _NOTE_ --- This is fancier than it needs to be.
  \*/
  private startListening(): void {
  this.appInstance.listen(this.PORT, () => {
  const indent: string = " ";
  const design: string =
  "`·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·´"; const uri: string =`http://localhost:${this.PORT}`;

      // console.log(chalk.magentaBright.bold(`\n${design}\n`));
      // console.log(
      //   chalk.cyanBright(`${indent}Listening on:\n`),
      //   chalk.reset.green.bold(`${indent + indent}-${uri}\n`),
      //   chalk.reset.cyanBright(`${indent + indent + indent} AND\n`),
      //   chalk.reset.green.bold(`${indent + indent}-${uri}\n`) // ! ${gqlServer.graphqlPath}\n`
      // );
      // console.log(chalk.reset.magentaBright.bold(`${design}\n`));

      console.log(
        chalk.magentaBright.bold(
          "`·._.·-·._.·-·._.·´¯`·._.·´¯`·._.·-·._.·-·._.·´"
        )
      );
      console.log(
        chalk.whiteBright.bold("   |     |     |       |       |     |     |")
      );
      console.log(
        chalk.whiteBright.bold("    ¯¯¯¯¯ ¯¯¯¯¯ ¯¯¯¯¯¯¯ ¯¯¯¯¯¯¯ ¯¯¯¯¯ ¯¯¯¯¯")
      );
      console.log(chalk.cyanBright.bold(`${indent}     Server running on:`));
      console.log(chalk.greenBright.bold(`${indent + indent + uri}`));
      console.log(chalk.cyanBright.bold(`${indent + indent + indent} AND`));
      console.log(chalk.greenBright.bold(`${indent + "   " + uri}/graphql`));
      console.log(
        chalk.whiteBright.bold("      _____ _____ _____ _____ _____ _____")
      );
      console.log(
        chalk.whiteBright.bold("     |     |     |     |     |     |     |")
      );
      console.log(
        chalk.magentaBright.bold(
          "`·.·´¯`·-·´¯`·-·´¯`·-·´¯`·-·´¯`·-·´¯`·-·´¯`·.·´"
        )
      );

  });
  }


                _.·´¯`·.__.·´¯`·.__
                                     ¯¯--_
                                          ¯-_
      _____.·---···´¯¯¯¯¯¯¯¯¯¯¯`···---·._____

/ /_.·-·._.·-·._.·´¯`·._.·´¯`·._.·-·._.·-·._\ /_| | | | | | |_\ /`---- \ /| | |\ / ----´ \
 | `¯´ ¯¯¯¯¯¯¯ ¯¯¯¯¯¯¯`¯´ |\
( \ / )
\ \ / /
\ \ **\_ \_\_\_** **\_** **\_** **\_** **\_ / /
\ ¯¯¯`---'----.|\_\_\_**|**\_**|.----'---´¯¯¯ /
-\_\_ **-
¯¯¯---********\_\_\_**********---¯¯¯

                 _.·´¯`·._.·´¯`·.__
                                     ¯¯--_
                                          ¯-_
      _____.·---···´¯¯¯¯¯¯¯¯¯¯¯`···---·._____  \
    /_.·-·._.·-·._.·´¯`·._.·´¯`·._.·-·._.·-·._\ \

/ | | | | | | | \ \
 / `---- \ /| | |\ / ----´ \ \ /`¯´ ¯¯¯¯¯¯¯ ¯¯¯¯¯¯¯ `¯´ \ ' ( )' \ / ' \ ____ _____ _____ _____ _____ ____ / / \ / | | | | | \ / / \ ´¯`·-·´¯`·-·´¯`·-·´¯`·-·´¯`·-·´¯`·-·´¯` / /
`¯¯¯¯¯¯`···---.****\_\_\_****.---···´¯¯¯¯¯¯´ /
