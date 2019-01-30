import bodyParser from "body-parser";
import chalk from "chalk";
import compression from "compression";
import SessionStore from "connect-pg-simple";
import express, { Application, NextFunction, Request, Response } from "express";
import session from "express-session";
import fs from "fs";
import http from "http";
import https from "https";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import { Connection, getConnection } from "typeorm";
import webpack, { Compiler } from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import config from "../webpack.dev.config";
import { User } from "./db";
import apollo from "./graphql";
import { ResponseError } from "./types";
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

  private configurations = {
    // Note: You may need sudo to run on port 443
    development: { ssl: false, port: 4000, hostname: "localhost" },
    production: { ssl: true, port: 443, hostname: "example.com" }
  };

  // ! new stuff
  private config: { ssl: boolean; port: number; hostname: string };
  private server: http.Server | https.Server;
  private NODE_ENV: string = process.env.NODE_ENV || "production";
  private SECRET: string =
    process.env.SESSION_SECRET ||
    "Peeps. Stand up to hard ware and step into style.";

  /**
   * If `enabled`, Hot Module Replacement is active. Enable *FOR DEVELOPMENT ONLY*
   */
  private HMR: "disabled" | "enabled" =
    process.env.HMR === "enabled" ? "enabled" : "disabled";

  constructor() {
    this.instance = express();
    this.config = this.configurations[this.NODE_ENV];

    // ! new stuff
    // Create the HTTPS or HTTP server, per configuration
    this.server = this.config.ssl
      ? // Assumes certificates are in .ssl folder from package root.
        // Make sure the files are secured.
        https.createServer(
          {
            cert: fs.readFileSync(`./ssl/${this.NODE_ENV}/server.crt`),
            key: fs.readFileSync(`./ssl/${this.NODE_ENV}/server.key`)
          },
          this.instance
        )
      : http.createServer(this.instance);
  }

  /**
   * Creates an app for development, applies `webpack-dev-middleware`
   * and `webpack-hot-middleware` to enable Hot Module Replacement if `process.env.HMR` is `enabled`.
   */
  public createAppDev(): void {
    this.syncDb()
      .then(dbConnection => this.applyMiddleware(dbConnection))
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
      .then(dbConnection => this.applyMiddleware(dbConnection))
      .then(() => this.staticallyServeFiles())
      .catch(err => console.log(err));
  }

  /**
   * Syncs the database to begin the creation of the server.
   */
  private async syncDb(): Promise<Connection> {
    const dbConnection = getConnection();
    if (dbConnection.isConnected === false) {
      await dbConnection.connect().catch(err => console.log(err));
    }
    return dbConnection;
  }

  /**
   * Creates the body of the server. Logging middleware (`morgan`),
   * body parsing middleware (`bodyParser`),
   * compression middleware (`compression`), as well as
   * session, passport, auth and the graphql api are applied here.
   */
  private applyMiddleware(dbConnection: Connection): void {
    this.instance.use((req, res, next) => {
      res.set({
        "Access-Control-Allow-Credentials": "same-origin",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "DELETE,GET,PATCH,POST,PUT",
        "Access-Control-Allow-Origin": this.config.hostname
      });

      next();
    });

    // logging middleware
    this.instance.use(morgan("dev"));

    // body parsing middleware
    this.instance.use(bodyParser.json());
    this.instance.use(bodyParser.urlencoded({ extended: true }));

    // compression middleware
    this.instance.use(compression());

    this.sessionAndPassport(dbConnection);
    this.graphql(dbConnection);
  }

  /**
   * Creates an express session and initialized passport with the session.
   */
  private sessionAndPassport(dbConnection: Connection): void {
    // session middleware with passport
    this.instance.use(
      session({
        cookie: {
          httpOnly: false,
          maxAge: 4 * 60 * 60 * 1000,
          path: "/", // ! ???
          secure: this.config.ssl
        },
        proxy: this.config.ssl,
        resave: false, // ! ???
        rolling: true, // ! ???
        saveUninitialized: false,
        secret: this.SECRET,
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

    // passport registration
    passport.serializeUser((user: User, done): void => done(null, user.id));
    passport.deserializeUser(
      async (id: string, done): Promise<void> => {
        try {
          const user = await dbConnection.getRepository(User).findOne({ id });
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
  private graphql(dbConnection: Connection): void {
    // * passes dbConnection to ApolloServer to add to context
    apollo(dbConnection).applyMiddleware({
      app: this.instance,
      cors: {
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
        methods: ["DELETE", "GET", "PATCH", "POST", "PUT"],
        origin: this.config.hostname
      }
    });

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
   * Starts listening to the server on `4000`.
   * *DEVELOPMENT ONLY*
   */
  private startListening(): void {
    this.server.listen(this.config.port, () =>
      prettyLogger(
        "log",
        "Listening on:",
        `  - ${chalk.greenBright(
          `http${this.config.ssl ? "s" : ""}://${this.config.hostname}:${
            this.config.port
          }${apollo().graphqlPath}`
        )}`
      )
    );
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
      // "*",
      webpackDevMiddleware(compiler, {
        logLevel: "warn",
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      })
    );

    this.instance.use(
      // "*",
      webpackHotMiddleware(compiler, {
        heartbeat: 2000,
        log: console.log,
        path: "",
        reload: false // true
      })
    );
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
      console.log("i am the lil meem", req.path);

      // ! for HMR
      // tslint:disable-next-line:no-unused-expression
      this.HMR === "enabled" &&
        res.set({
          Connection: "keep-alive",
          "Content-Type": "text/event-stream"
        });

      // res.sendFile(path.join(__dirname, ...rootDir, "public", "index.html"));
    });
  }
}
