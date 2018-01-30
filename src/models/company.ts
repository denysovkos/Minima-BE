import {Document, Model, model, Schema, Types} from "mongoose";
import company from "../routers/company/index";

export interface ICompany extends Document {
    name: string;
    address: string[];
    logo: string;
    bankAccounts: string[];
    ceo: string;
    code: number;
}

export interface ICompanyModel {
    findAll(callback: Function): ICompany[];
}

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: Array,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    bankAccounts: {
        type: Array,
        required: true,
    },
    ceo: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
        unique: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    _id: {
        type: String,
    },
    relatedUser: {
        type: Array,
        required: true,
    },
});

companySchema.static("findAll", (callback: Function) => {
    Company.find({}, callback);
});

export type CompanyModel = Model<ICompany> & ICompanyModel & ICompany;

export const Company: CompanyModel = model<ICompany>("Company", companySchema) as CompanyModel;
