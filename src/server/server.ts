import bodyParser from "body-parser";
import chalk from "chalk";
import compression from "compression";
import SessionStore from "connect-pg-simple";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { Strategy } from "passport-local";
import path from "path";
import { getConnection } from "typeorm";
import webpack, { Compiler } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import { ISignupAndLogin } from "src/typings";
import { isEmail } from "../utils";
import { ResponseError } from "./server.d";

import config from "../webpack.dev.config";
import { User } from "./db";
import gqlServer from "./graphql";
import { prettyLogger } from "./utils";

/**
 * Contains the logic for running the server in both development and production.
 * Instantiated in `server/index`.
 */
export default class Server {
  /**
   * The instance of the express server.
   */
  public instance: Application;

  /**
   * The port that the application runs on.
   */
  private PORT: number = Number(process.env.PORT) || 3000;

  /**
   * If `enabled`, Hot Module Replacement is active. Enable *FOR DEVELOPMENT ONLY*
   */
  private HMR: "disabled" | "enabled" =
    process.env.HMR === "enabled" ? "enabled" : "disabled";

  constructor() {
    this.instance = express();
  }

  /**
   * Creates an app for development, applies `webpack-dev-middleware`
   * and `webpack-hot-middleware` to enable Hot Module Replacement if `process.env.HMR` is `enabled`.
   */
  public createAppDev(): void {
    this.syncDb()
      .then(() => this.applyMiddleware())
      .then(() => this.startListening())
      .then(() => this.HMR === "enabled" && this.webpackDevMiddleware())
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * Creates an optimized production instance of the express server.
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
    const db = getConnection();
    if (db.isConnected === false) {
      await db.connect().catch(err => console.log(err));
    }
  }

  /**
   * Creates the body of the server. Logging middleware (`morgan`),
   * body parsing middleware (`bodyParser`), compression middleware
   * (`compression`), as well as session, passport, auth and
   * the graphql api are applied here.
   */
  private applyMiddleware(): void {
    // logging middleware
    this.instance.use(morgan("dev"));

    // cookie parsing middleware
    this.instance.use(cookieParser());

    // body parsing middleware
    this.instance.use(bodyParser.json());
    this.instance.use(bodyParser.urlencoded({ extended: true }));

    // compression middleware
    this.instance.use(compression());

    this.sessionAndPassport();
    this.graphql();
  }

  /**
   * Creates an express session and initialized passport with the session.
   */
  private sessionAndPassport(): void {
    // session middleware with passport
    this.instance.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret:
          process.env.SESSION_SECRET ||
          "Peeps. Stand up to hard ware and step into style.",
        store: new (SessionStore(session))({
          conObject: {
            database: "ts_react_gql_express_boilerplate",
            host: "localhost",
            password: "password",
            port: 5432,
            user: "kyleuehlein" // ! ------
          }
        })
      })
    );

    this.instance.use(passport.initialize());
    this.instance.use(passport.session());

    // passport local strategy
    passport.use(
      new Strategy(
        {
          passReqToCallback: true
          // usernameField: "emailOrUsername"
        },
        async (req, emailOrUsername, password, done) => {
          console.log("we are in the thing", emailOrUsername, password);

          let key: "email" | "username";
          if (isEmail(emailOrUsername)) {
            key = "email";
            emailOrUsername = emailOrUsername.toLowerCase();
          } else {
            key = "username";
          }

          await User.findOne({ [key]: emailOrUsername })
            .then(user => {
              if (!user) {
                return done(null, false, { message: `Incorrect ${key}.` });
              }
              if (!user.isValidPassword(password)) {
                return done(null, false, { message: "Incorrect password." });
              }
              console.log("all is good in local strategy");
              return done(null, user);
            })
            .catch(err => {
              return done(err);
            });
        }
      )
    );

    // passport registration
    passport.serializeUser((user: User, done): void => done(null, user.id));
    passport.deserializeUser(
      async (id: string, done): Promise<void> => {
        try {
          const user = await User.findOne({ id });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    );
  }

  /**
   * Route to graphql api.
   */
  private graphql(): void {
    function isAuthenticated(req, res, next) {
      return req.isAuthenticated() ? next() : res.redirect("/auth/google");
    }

    // this.instance.use(
    //   "/graphql",
    //   isAuthenticated,
    //   graphqlHTTP(req => ({
    //     schema,
    //     graphiql: true,
    //     context: req
    //   }))

    gqlServer.applyMiddleware({ app: this.instance });

    // handle requests that miss end points above
    this.errorHandlingEndware();
  }

  /**
   * Handles any errors that have been passed down
   * without being handled earlier on.
   */
  private errorHandlingEndware(): void {
    this.instance.use(
      (
        err: ResponseError,
        req: Request,
        res: Response,
        next: NextFunction
      ): void => {
        console.error(err);
        console.error(err.stack);
        res
          .status(err.status || 500)
          .send(err.message || "Internal server error.");
      }
    );
  }

  /**
   * Starts listening to the server on `process.env.PORT` or `3000`.
   * *DEVELOPMENT ONLY*
   */
  private startListening(): void {
    this.instance.listen(this.PORT, () => {
      const uri: string = `http://localhost:${this.PORT}`;

      prettyLogger(
        "log",
        "Listening on:",
        `  - ${chalk.greenBright(uri)}`,
        "             AND",
        `  - ${chalk.greenBright(uri)}${gqlServer.graphqlPath}`
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
    this.instance.use(
      webpackDevMiddleware(compiler, {
        logLevel: "warn",
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      })
    );
    this.instance.use(
      webpackHotMiddleware(compiler, {
        heartbeat: 2000,
        log: console.log,
        path: "",
        reload: true
      })
    );
    this.instance.use("/", (req, res, next) => {
      res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream"
      });
    });
  }

  /**
   * Serves the static bundle generated by webpack,
   * as well as the other static assets like css and html files.
   */
  private staticallyServeFiles(): void {
    // path to root
    const rootDir = ["..", ".."];

    // staticly serve styles
    this.instance.use(
      express.static(
        path.join(__dirname, ...rootDir, "src", "client", "main.css")
      )
    );

    // static file-serving middleware then send 404 for the rest (.js, .css, etc.)
    this.instance
      .use(express.static(path.join(__dirname, ...rootDir)))
      .use((req, res, next) =>
        path.extname(req.path).length
          ? next(new Error("404 - Not found"))
          : next()
      );

    // sends index.html
    this.instance.use("*", (req, res) => {
      res.sendFile(path.join(__dirname, ...rootDir, "public", "index.html"));
    });
  }
}
