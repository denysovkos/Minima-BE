import { Company } from './../../models/company';
import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';

import * as mongoose from 'mongoose';

export class Status extends BaseRoute {
    
    public apiStatusAction(router: Router): void {
        router.get('/*', async (req: Request, res: Response): Promise<void> => {
            let dbStatus = mongoose.connection.readyState;
            let isConfigured = await Company.find({}, (err: Error, com) => com);

            res.json({
                apiStatus: true,
                DBStatus: dbStatus === 1 ? 'alive' : 'down',
                isConfigured: Boolean(isConfigured.length)
            });
        });
    }
}

