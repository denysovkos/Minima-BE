import { Company as CompanyModel } from './../../models/company';
import { Router, Request, Response } from 'express';
import { BaseRoute } from '../BaseRoute';
import { v4 as uuid } from 'uuid';
import * as mongoose from 'mongoose';

export class Company extends BaseRoute {

    public loadCompanyAction(router: Router): void {
        router.get('/id/:id', this.guard, async (req: Request & {params: {id: string}}, res: Response): Promise<void> => {
            const currentUserId = req.body.user._id;
            await CompanyModel.find({relatedUser: { "$in" : [currentUserId]}, _id: req.params.id }, (err, company) => {
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

    public loadAllCompaniesAction(router: Router): void {
        router.get('/all', this.guard, async (req: Request, res: Response): Promise<void> => {
            const currentUserId = req.body.user._id;
            await CompanyModel.find({relatedUser: { "$in" : [currentUserId]} }, (err: Error, companies) => {
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
                        companies
                    });
                }
            });
        });
    }

    public createCompanyAction(router: Router): void {
        router.post('/create', this.guard, async (req: Request, res: Response) => {
            const newCompany = new CompanyModel({
                ...req.body,
                relatedUser: [req.body.user._id],
                _id: uuid.v4()
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

