import bodyParser from "body-parser";
import chalk from "chalk";
import compression from "compression";
import express from "express";
// import session from "express-session";
import morgan from "morgan";
// import passport from "passport";
import path from "path";
import webpack, { Compiler, Configuration } from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import db from "./db";
// import gqlServer from "./graphql";

// tslint:disable-next-line
// const SequelizeStore = require("connect-session-sequelize")(session.Store);
// const sessionStore = new SequelizeStore({ db });

export default class Server {
  public appInstance: express.Application;

  private PORT: number = Number(process.env.PORT) || 3000;

  constructor() {
    this.appInstance = express();
  }

  /**
   * createAppDev
   *   *NOTE* --- `this.webpack` must come before `this.staticallyServeFiles`
   */
  public createAppDev(): void {
    // transpile options for rest of files (other than webpack.config + server/index + server/server)
    // const options: TranspileOptions = {
    //   compilerOptions: {
    //     allowSyntheticDefaultImports: true,
    //     alwaysStrict: true,
    //     esModuleInterop: true,
    //     module: tsc.ModuleKind.CommonJS,
    //     moduleResolution: tsc.ModuleResolutionKind.NodeJs,
    //     target: tsc.ScriptTarget.ES5
    //   }
    // };

    // ! vvv
    // const exec = require("child_process").exec;
    // exec("webpack.dev.config.js", (err, stdout, stderr) => {
    //   //   stdout is the stuff i need?
    //   console.log("------------", stdout);
    // });
    // orrrr
    // const { spawn } = require("child_process");
    // const ls = spawn("ls", ["-lh", "/usr"]);

    // ls.stdout.on("data", data => {
    //   console.log(`stdout: ${data}`);
    // });

    // ls.stderr.on("data", data => {
    //   console.log(`stderr: ${data}`);
    // });

    // ls.on("close", code => {
    //   console.log(`child process exited with code ${code}`);
    // });

    const syncAndListen: Promise<void> = this.syncDb()
      .then(() => this.createApp())
      .then(() => this.startListening());

    const buildAndServe: Promise<void> = this.webpack().then(() =>
      this.staticallyServeFiles()
    );

    Promise.all([syncAndListen, buildAndServe]).catch(err => console.log(err));
  }

  /**
   * createAppProd
   */
  public createAppProd(): void {
    this.syncDb()
      .then(() => this.createApp())
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * syncDb
   */
  private async syncDb(): Promise<void> {
    await db.sync();
  }

  /**
   * createApp
   */
  private createApp(): void {
    // logging middleware
    this.appInstance.use(morgan("dev"));

    // body parsing middleware
    this.appInstance.use(bodyParser.json());
    this.appInstance.use(bodyParser.urlencoded({ extended: true }));

    // compression middleware
    this.appInstance.use(compression());

    this.sessionAndPassport();
    this.auth();
    this.graphql();
  }

  /**
   * sessionAndPassport
   */
  private sessionAndPassport(): void {
    // session middleware with passport
    // this.appInstance.use(
    //   session({
    //     resave: false,
    //     saveUninitialized: false,
    //     secret:
    //       process.env.SESSION_SECRET ||
    //       "Peeps. Stand up to hard ware and step into style.",
    //     store: sessionStore
    //   })
    // );
    // this.appInstance.use(passport.initialize());
    // this.appInstance.use(passport.session());
  }

  /**
   * auth
   */
  private auth(): void {
    // TODO: app.use('/auth', require('./auth'));
  }

  /**
   * graphql
   */
  private graphql(): void {
    // gqlServer.applyMiddleware({ app: this.appInstance });

    // handle requests that miss end points above
    this.errorHandlingEndware();
  }

  /**
   * startListening
   *   *NOTE* --- This is fancier than it needs to be.
   */
  private startListening(): void {
    this.appInstance.listen(this.PORT, () => {
      const indent: string = "         ";
      const design: string =
        "`·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·-·._.·´¯`·._.·´";
      const uri: string = `http://localhost:${this.PORT}`;

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

  /**
   * webpack
   *   *NOTE* --- Do not use nodemon or anything that restarts server... // ! details ???
   */
  private async webpack(/* config /* : Configuration */): Promise<void> {
    // ? "webpack --config webpack.config.vendor.js

    const { spawn } = require("child_process"); // fork || exec
    const child = spawn("webpack", [
      "--config=public/dist/ts-sourcemap/config/webpack.dev.config.js",
      "--extensions .ts" // config/tsconfig.client.json
    ]);

    // exit, disconnect, error, close, and message.
    // child.stdin, child.stdout, and child.stderr

    // child.stdout.on("data", data => {
    //   console.log(`child stdout:\n${data}`);
    // });

    // child.on("exit", (code, signal) =>
    //   console.log(
    //     `child process exited with\ncode ${code} and signal ${signal}`
    //   )
    // );

    const config = require("../config/webpack.dev.config"); // !
    const compiler: Compiler = webpack(config.default); // !
    // const hotMiddlewareScript: string =
    //   "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

    console.log("-----???----------------->", config.default.module.rules);

    this.appInstance.use(
      webpackMiddleware(compiler, {
        publicPath: config.default.output.publicPath,
        serverSideRender: true,
        stats: {
          colors: true
        }
      })
    );
    this.appInstance.use(
      webpackHotMiddleware(compiler, {
        heartbeat: 2000,
        path: "__webpack_hmr"
      })
    );
    this.appInstance.use("/", (req, res, next) => {
      res.writeHead(200, {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream"
      });
      res.end(); // hotMiddlewareScript);
    });
  }

  /**
   * staticallyServeFiles
   *   *NOTE* --- The relative paths refer to the locations of the files after being compiled
   */
  private staticallyServeFiles(): void {
    // staticly serve styles
    this.appInstance.use(
      express.static(path.join(__dirname, "..", "client/", "src/", "main.css")) // ! css wont be tsc
    );

    // static file-serving middleware then send 404 for the rest (.js, .css, etc.)
    this.appInstance
      .use(express.static(path.join(__dirname, "..", "..", "..")))
      .use(
        (req, res, next) =>
          path.extname(req.path).length
            ? next(new Error(`404 - Not found`))
            : next()
      );

    // sends index.html
    this.appInstance.use("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "..", "..", "index.html"));
    });
  }

  /**
   * errorHandlingEndware
   */
  private errorHandlingEndware(): void {
    this.appInstance.use((err, req, res, next) => {
      console.error(err);
      console.error(err.stack);
      res
        .status(err.status || 500)
        .send(err.message || "Internal server error.");
    });
  }
}

/*

`
                _.·´¯`·.__.·´¯`·.__
                                     ¯¯--_
                                          ¯-_
      _____.·---···´¯¯¯¯¯¯¯¯¯¯¯`···---·._____
 /  /_.·-·._.·-·._.·´¯`·._.·´¯`·._.·-·._.·-·._\
   /_|     |     |       |       |     |     |_\
  /   `---- \   /|       |       |\   / ----´   \
  |          `¯´  ¯¯¯¯¯¯¯ ¯¯¯¯¯¯¯  `¯´          |\
(  \                                           /  )
 \  \                                         /  /
  \  \    ___ _____ _____ _____ _____ ___    /  /
   \  ¯¯¯`---'----.|_____|_____|.----'---´¯¯¯  /
     -__                                   __-
         ¯¯¯---_____________________---¯¯¯
`


*/
