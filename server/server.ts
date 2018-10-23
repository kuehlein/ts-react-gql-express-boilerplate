import bodyParser from "body-parser";
import chalk from "chalk";
import { spawn } from "child_process";
import compression from "compression";
import express, { Application, NextFunction, Request, Response } from "express";
// import session from "express-session";
import morgan from "morgan";
// import passport from "passport";
import path from "path";
import webpack, { Compiler } from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import config from "../config/webpack.dev.config";
import db from "./db";
import { prettyLogger } from "./utils";
// import gqlServer from "./graphql";

// tslint:disable-next-line
// const SequelizeStore = require("connect-session-sequelize")(session.Store);
// const sessionStore = new SequelizeStore({ db });

/**
 * Contains the logic for running the server in both development and production.
 * Instantiated in `server/index`.
 */
export default class Server {
  public appInstance: Application;

  private PORT: number = Number(process.env.PORT) || 3000;

  constructor() {
    this.appInstance = express();
  }

  /**
   * Creates an app for development, applies `webpack-dev-middleware`
   * and `webpack-hot-middleware` to enable Hot Module Replacement.
   * *NOTE* --- Respect the order:
   * `this.webpack` -> `this.webpackDevMiddleware` -> `this.staticallyServeFiles`
   */
  public createAppDev(): void {
    const syncAndListen: Promise<void> = this.syncDb()
      .then(() => this.createApp())
      .then(() => this.startListening());

    const buildAndServe: Promise<void> = this.webpack()
      .then(() => this.webpackDevMiddleware())
      .then(() => this.staticallyServeFiles());

    Promise.all([syncAndListen, buildAndServe]).catch(err => console.log(err));
  }

  /**
   * Creates an optimized production application build.
   */
  public createAppProd(): void {
    this.syncDb()
      .then(() => this.createApp())
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * Syncs the database to begin the creation of the server.
   */
  private async syncDb(): Promise<void> {
    await db.sync();
  }

  /**
   * Creates the body of the server. Logging middleware (`morgan`),
   * body parsing middleware (`bodyParser`), compression middleware
   * (`comporession`), as well as session, passport, auth and
   * the graphql api are applied here.
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
   * Creates an express session and initialized passport with the session.
   */
  private sessionAndPassport(): void {
    // TODO: ----------------------------------------------------
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
    // TODO: ----------------------------------------------------
  }

  /**
   * Route to user authentication.
   */
  private auth(): void {
    // TODO: app.use('/auth', require('./auth'));
  }

  /**
   * Route to graphql api.
   */
  private graphql(): void {
    // TODO: gqlServer.applyMiddleware({ app: this.appInstance });

    // handle requests that miss end points above
    this.errorHandlingEndware();
  }

  /**
   * Starts listening to the server on `process.env.PORT` or `3000`.
   * *DEVELOPMENT ONLY*
   */
  private startListening(): void {
    this.appInstance.listen(this.PORT, () => {
      const uri: string = `http://localhost:${this.PORT}`;

      prettyLogger(
        "log",
        "Listening on:\n",
        `  - ${chalk.greenBright(uri)}`,
        "             AND",
        `  - ${chalk.greenBright(uri)}` // ! ${gqlServer.graphqlPath}\n`
      );
    });
  }

  /**
   * Spawns a webpack child process using the development configuration.
   * *DEVELOPMENT ONLY*
   */
  private async webpack(): Promise<void> {
    const child = spawn(
      "webpack --config=public/dist/ts-sourcemap/config/webpack.dev.config.js",
      [],
      {
        detached: true,
        shell: true,
        stdio: "inherit"
      }
    );

    child.on("exit", (code, signal) => {
      child.kill();

      prettyLogger(
        "warn",
        "Child process (webpack)",
        "    exited with:\n",
        `    - CODE: ${chalk.cyanBright(String(code))}`,
        `    - SIGNAL: ${chalk.cyanBright(signal)}`
      );
    });
  }

  /**
   * Middleware to disable node.js caching
   */
  private noCache(req: Request, res: Response, next: NextFunction) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  }

  /**
   * Applies `webpack-dev-middleware` and `webpack-hot-middleware`
   * to enable Hot Module Replacement in development.
   * *NOTE* --- Do not use nodemon or anything that restarts server...
   * *DEVELOPMENT ONLY*
   */
  private webpackDevMiddleware(): void {
    const compiler: Compiler = webpack(config);

    this.appInstance.use(
      webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
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
        // "Cache-Control": "no-cache", // ! ???
        Connection: "keep-alive",
        "Content-Type": "text/event-stream"
      });
      res.end();
    });
  }

  /**
   * Serves the static bundle generated by webpack,
   * as well as the other static assets like css and html files.
   * *NOTE* --- The relative paths refer to the locations of the files after being transpiled
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
   * Handles any errors that have been passed down
   * without being handled earlier on.
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
