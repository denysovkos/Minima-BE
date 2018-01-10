import { Router, Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { has } from 'lodash';

import { User } from '../../models/user';
import user from './index';

//TODO: DELETE THIS FUNC!
export const getAllUsers = (req: Request, res: Response, next: NextFunction): void => {
    User.find({}, (err, users) => {
        console.log('USERS: ', users);
        res.send(users);
        next();
    })
};

export async function isAdminUsersInDb(): Promise<boolean> {
    let users = await User.find({role: 'admin'}, (err, users) => {
        if (err) console.log(err)
        return users;
    });

    return users.length ? true : false;
};

export async function createFirstAdmin(): Promise<void> {
    console.log('Will create first admin');
    const options = { upsert: true, new: true };
    User.findOneAndUpdate({email: 'admin@admin.com', role: 'admin'}, {}, options, (error, user) => {
        if (!error) {
            if (!has(user, 'password')) {
                let firstAdmin = new User({
                    name : 'admin',
                    email: 'admin@admin.com',
                    password: 'admin',
                    role: 'admin'
                });

                User.updateUser(user._id, firstAdmin, (err, user)=>{
                    if (err) {
                        console.error(err.toString());
                    } else {
                        console.log('First admin was created', '\n',
                            'email: ', user.email, '\n',
                            'password: admin', '\n')
                    }
                });
            }
        
        }
    })
}