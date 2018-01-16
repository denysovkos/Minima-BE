/**
 * application main router
 */
import * as express from 'express';

import {default as userRouter} from './user';
import {default as apiStatusRouter} from './api';
import {default as companyRouter} from './company';

const api = express.Router();

api.use('/api', apiStatusRouter);
api.use('/company', companyRouter);
api.use('/user', userRouter);

export default api;