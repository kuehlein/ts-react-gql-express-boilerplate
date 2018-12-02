import bodyParser from "body-parser";
import chalk from "chalk";
import compression from "compression";
import express, { Application } from "express";
// import session from "express-session";
import morgan from "morgan";
// import passport from "passport";
import path from "path";
import webpack, { Compiler } from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import config from "../webpack.dev.config";
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
   */
  public createAppDev(): void {
    this.syncDb()
      .then(() => this.applyMiddleware())
      .then(() => this.startListening())
      .then(() => this.webpackDevMiddleware()) // ! dont use for "watch-server"
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * Creates an app for development, applies `webpack-dev-middleware`
   * and `webpack-hot-middleware` to enable Hot Module Replacement.
   */
  public createAppProd(): void {
    this.syncDb()
      .then(() => this.applyMiddleware())
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
   * (`compression`), as well as session, passport, auth and
   * the graphql api are applied here.
   */
  private applyMiddleware(): void {
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

  /**
   * Starts listening to the server on `process.env.PORT` or `3000`.
   * *DEVELOPMENT ONLY*
   */
  private startListening(): void {
    this.appInstance.listen(this.PORT, () => {
      const uri: string = `http://localhost:${this.PORT}`;

      prettyLogger(
        "log",
        "Listening on:",
        `  - ${chalk.greenBright(uri)}`,
        "             AND",
        `  - ${chalk.greenBright(uri)}` // ! ${gqlServer.graphqlPath}\n`
      );
    });
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
        logLevel: "warn",
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      })
    );
    this.appInstance.use(
      webpackHotMiddleware(compiler, {
        heartbeat: 2000,
        log: console.log,
        path: "",
        reload: true
      })
    );
    this.appInstance.use("/", (req, res, next) => {
      res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream"
      });
    });
  }

  /**
   * Serves the static bundle generated by webpack,
   * as well as the other static assets like css and html files.
   * *NOTE* --- The relative paths refer to the locations of the files after being transpiled
   */
  private staticallyServeFiles(): void {
    // path to root
    const rootDir = ["..", ".."];

    // staticly serve styles
    this.appInstance.use(
      express.static(
        path.join(__dirname, ...rootDir, "src", "client", "main.css")
      )
    );

    // static file-serving middleware then send 404 for the rest (.js, .css, etc.)
    this.appInstance
      .use(express.static(path.join(__dirname, ...rootDir)))
      .use((req, res, next) =>
        path.extname(req.path).length
          ? next(new Error("404 - Not found"))
          : next()
      );

    // sends index.html
    this.appInstance.use("*", (req, res) => {
      res.sendFile(path.join(__dirname, ...rootDir, "public", "index.html"));
    });
  }
}
