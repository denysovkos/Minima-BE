import { Request, Response, Router } from "express";
import * as jwt from "jsonwebtoken";

import { User } from "../../models/user";
import { BaseRoute } from "../BaseRoute";

export class Auth extends BaseRoute {

    public loginAction(router: Router): void {
        router.post("/login", (req: Request, res: Response) => {
            const email = req.body.email;
            const re = /\S+@\S+\.\S+/;

            if (!re.test(email)) {
                res.status(400);
                res.json({
                    success: false,
                    message: "Validation error - wrong email input.",
                });
                return false;
            }

            User.findByEmail(email, (err, user) => {
                if (user) {
                    User.comparePassword(req.body.password, user.password, (err, isMatch) => {
                        if (err) {
                            this.logger.error(err.toString());
                            res.status(500);
                            res.json({
                                success: false,
                                message: "something went wrong.",
                            });
                        } else if (isMatch) {
                            const token = jwt.sign(user, process.env.APPLICATION_SECRET, {
                                expiresIn: 604800, // 1 week
                            });

                            res.json({
                                success: true,
                                token,
                                user: {
                                    name: user.name,
                                    role: user.role,
                                    email: user.email,
                                },
                            });
                        } else {
                            res.status(400);
                            res.json({
                                success: false,
                                message: "wrong credentials.",
                            });
                        }
                    });
                } else {
                    res.status(400);
                    res.json({
                        success: false,
                        message: "wrong credentials.",
                    });
                }
            });
        });
    }

    public registerAction(router: Router): void {
        router.post("/register", (req: Request, res: Response) => {
            const re = /\S+@\S+\.\S+/;

            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const role = req.body.role;

            if (!name || !re.test(email) || !password || password.length < 6) {
                res.status(400);
                res.json({
                    success: false,
                    message: "wrong input.",
                });
                return false;
            }

            User.findByEmail(email, (err, user) => {
                if (err) {
                    this.logger.error(err.toString());
                    res.status(500);
                    res.json({
                        success: false,
                        message: "something went wrong.",
                    });
                } else if (!user) {
                    const user = new User({
                        name,
                        email,
                        password,
                        role,
                    });

                    User.createUser(user, (err, user) => {
                        if (err) {
                            this.logger.error(err.toString());
                            res.status(500);
                            res.json({
                                success: false,
                                message: "something went wrong.",
                            });
                        } else {
                            res.json({
                                success: true,
                                message: "user created.",
                            });
                        }
                    });
                } else {
                    res.status(400);
                    res.json({
                        success: false,
                        message: "this email address has already been taken.",
                    });
                }
            });
        });
    }

    public profileAction(router: Router): void {
        router.get("/profile", this.guard, (req: Request, res: Response) => {
            const userProfile = {
                email: req.body.user.email,
                name: req.body.user.name,
                role: req.body.user.role,
            };

            res.json({
                success: true,
                user: userProfile,
            });
        });
    }
}
