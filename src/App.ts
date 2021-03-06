import * as bodyParser from "body-parser";
import * as colors from "colors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as passport from "passport";

import { PassportConfig } from "./config/passport";
import {default as routers} from "./routers";

import { createFirstAdmin, getAllUsers, isAdminUsersInDb } from "./routers/user/Init";

class App {

    public express: express.Application;

    constructor() {
        this.setEnvironment();
        this.express = express();

        this.database()
            .then (async () => {
                console.log(colors.green("Checking for first admin"));
                const adminUsersInDb = await isAdminUsersInDb();

                if (!adminUsersInDb) {
                    await createFirstAdmin();
                } else {
                    console.log(colors.green("All users already created"));
                }
            })
            .catch ((err) =>  console.log(colors.red("ERR IN USER IN DB INIT: ", err)));

        this.middleware();
        this.routes();
    }

    /**
     * database connection
     */
    private database(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            console.log("Connecting to Data base");
            mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
            mongoose.connection.on("error", () => {
            console.log("MongoDB connection error. Please make sure MongoDB is running.");
            process.exit();
            });

            resolve(true);
        });
    }

    /**
     * http(s) request middleware
     */
    private middleware(): void {
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*"); // dev only
            res.header("Access-Control-Allow-Methods", "OPTIONS,GET,PUT,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            if (req.method === "OPTIONS") {
                res.status(200).send();
            } else {
                next();
            }
        });
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        const pConfig = new PassportConfig(passport);
        pConfig.init();
    }

    /**
     * app environment configuration
     */
    private setEnvironment(): void {
        dotenv.config({ path: ".env" });
    }

    /**
     * API main v1 routes
     */
    private routes(): void {
        this.express.use("/v1", routers);

        //TODO: REMOVE THIS AFTER USER AUTH COMPLETED!!!
        //this.express.get('/users', getAllUsers);

        this.express.use("/", (req, res) => {
            res.status(404).send({ error: `path doesn't exist`});
        });
    }

}

export default new App().express;
