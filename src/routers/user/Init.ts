import { NextFunction, Request, Response, Router } from "express";
import { has } from "lodash";
import * as winston from "winston";

import { User } from "../../models/user";
import user from "./index";

export async function isAdminUsersInDb(): Promise<boolean> {
    const users = await User.find({role: "admin"}, (err, users) => {
        if (err) { console.log(err); }
        return users;
    });

    return users.length ? true : false;
}

export async function createFirstAdmin(): Promise<void> {
    console.log("Will create first admin");
    const options = { upsert: true, new: true };
    User.findOneAndUpdate({email: "admin@admin.com", role: "admin"}, {}, options, (error, user) => {
        if (!error) {
            if (!has(user, "password")) {
                const firstAdmin = new User({
                    name : "admin",
                    email: "admin@admin.com",
                    password: "admin",
                    role: "admin",
                });

                User.updateUser(user._id, firstAdmin, (err, user) => {
                    if (err) {
                        console.error(err.toString());
                    } else {
                        console.log("First admin was created", "\n",
                            "email: ", user.email, "\n",
                            "password: admin", "\n");
                    }
                });
            }

        }
    });
}
