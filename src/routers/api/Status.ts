import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';

import * as mongoose from 'mongoose';

export class Status extends BaseRoute {
    
    public apiStatusAction(router: Router): void {
        router.get('/*', (req: Request, res: Response) => {
            let dbStatus = mongoose.connection.readyState;

            res.json({
                success: true,
                DBStatus: dbStatus === 1 ? 'alive' : 'down'
            });
        });
    }
}

