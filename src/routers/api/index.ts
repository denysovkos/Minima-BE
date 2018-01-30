/**
 * api router
 */
import * as express from "express";
import {Status} from "./Status";

const status = express.Router();

status.use("/status", new Status().getRoutes());

export default status;
