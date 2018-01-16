import {Schema, Model, Document, model} from 'mongoose';

export interface ICompany extends Document {
    name: string;
    address: string[];
    logo: string;
    bankAccounts: string[];
    ceo: string;
    code: number;
}

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: Array,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    bankAccounts: {
        type: Array,
        required: true
    },
    ceo: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    createAt: {
        type: Date,
        "default": Date.now()
    },
    updatedAt: {
        type: Date,
        "default": Date.now()
    }
});

export type CompanyModel = Model<ICompany> & ICompany;

export const Company: CompanyModel = <CompanyModel>model<ICompany>("Company", companySchema);