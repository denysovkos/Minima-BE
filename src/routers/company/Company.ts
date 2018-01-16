import { Company as CompanyModel } from './../../models/company';
import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';

import * as mongoose from 'mongoose';

export class Company extends BaseRoute {

    public loadCompanyAction(router: Router): void {
        router.get('/:id', async (req: Request & {params: {id: string}}, res: Response): Promise<void> => {
            await CompanyModel.findById(req.params.id, (err, company) => {
                if (err) {
                    this.logger.error(err.toString());
                    res.status(500);
                    res.json({
                        success: false,
                        message: 'something went wrong.'
                    });
                } else {
                    res.json({
                        success: true,
                        company
                    });
                }
            });
        });
    }

    public createCompanyAction(router: Router): void {
        router.post('/create', async (req: Request, res: Response) => {

            const newCompany = new CompanyModel({
                ...req.body
            });

            await CompanyModel.create(newCompany, (err, company) => {
                if (err) {
                    this.logger.error(err.toString());
                    res.status(500);
                    res.json({
                        success: false,
                        message: 'something went wrong.'
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'company created.',
                        company
                    });
                }
            });

        });
    }
}

