/**
 * application main router
 */
import * as express from 'express';

import {default as userRouter} from './user';
import {default as apiStatusRouter} from './api';

const api = express.Router();

api.use('/user', userRouter);
api.use('/api', apiStatusRouter);

export default api;