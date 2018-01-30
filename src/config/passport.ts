import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../models/user";

/**
 * passport jwt configuration
 */
export class PassportConfig {

    public passport: Passport;

    constructor(passport: any) {
        this.passport = passport;
    }

    public init() {
        const opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            secretOrKey: process.env.APPLICATION_SECRET,
        };

        this.passport.use(new Strategy(opts, (jwtPayload, done) => {
            User.findOne({_id: jwtPayload._doc._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }
}
