import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import { BaseRoute } from "../BaseRoute";

import { User } from "../../models/user";
import { Company } from "./../../models/company";

export class Status extends BaseRoute {

    public apiStatusAction(router: Router): void {
        router.get("/*", async (req: Request, res: Response): Promise<void> => {
            const dbStatus = mongoose.connection.readyState;
            const isConfigured = await Company.find({}, (err: Error, com) => com);
            const isDefaultAdmin = await User.findOne({email: "admin@admin.com"}, (err, user) => user);

            res.json({
                apiStatus: true,
                DBStatus: dbStatus === 1 ? "alive" : "down",
                isConfigured: {
                    company: !Boolean(isConfigured.length),
                    admin: !Boolean(isDefaultAdmin),
                },
            });
        });
    }
}
