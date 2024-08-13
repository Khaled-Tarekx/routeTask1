import {Schema, Types, model} from 'mongoose';

const regexString = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const companySchema = new Schema(
	{
		companyName: {type: String, unique: true},

		description: String,
		industry: String,
		address: String,
		numberOfEmployees: {
			type: Number,
			min: [11, 'must be 11 or more Employees'],
			max: [20, 'must be 20 or less Employees'],
		},
		companyEmail: {
			type: String,
			unique: true,
			required: true,
		},
		companyHR: {type: Types.ObjectId, ref: 'user', required: true},
	},
	{timestamps: true}
);

const Company = model('company', companySchema);
export default Company;
