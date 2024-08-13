import Company from './models.js';
import j from 'joi';
import {Types} from 'mongoose';

export const checkCompanyNameAndEmailUniqueness = async (req, res, next) => {
	const {companyName, companyEmail} = req.body;
	const CompanyExistsWithEmail = await Company.findOne({companyEmail});
	if (CompanyExistsWithEmail) {
		return res
			.status(400)
			.json({message: `a company already exists with the given email`});
	}
	const companyExistsWithName = await Company.findOne({companyName});
	if (companyExistsWithName) {
		return res
			.status(400)
			.json({message: `a company already exists with the given name`});
	}
	next();
};

export const objectId = j.string().custom((value, helpers) => {
	if (!Types.ObjectId.isValid(value)) {
		return helpers.message(`${value} is not a valid ObjectId`);
	}
	return value;
}, 'ObjectId Validation');
