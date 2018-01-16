/**
 * company router
 */
import * as express from 'express';
import {Company} from './Company';

const company = express.Router();

company.use('/info', new Company().getRoutes());

export default company;