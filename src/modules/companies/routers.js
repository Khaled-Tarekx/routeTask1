import express from 'express';

const router = express.Router();
import {
	createCompany,
	deleteCompany,
	updateCompany,
	searchForCompany,
	getCompanyApplications,
	getCompanyData,
} from './controllers.js';

import {iscompanyHr, validateResource} from '../auth/middlewares.js';
import {checkCompanyNameAndEmailUniqueness} from './helpers.js';
import {companyValidation, updateCompanyValidation} from './validation.js';

router.post(
	'/',
	iscompanyHr,
	checkCompanyNameAndEmailUniqueness,
	validateResource(companyValidation),
	createCompany
);

router.get('/search', searchForCompany);
router.get(
	'/applications-for/:companyId',
	iscompanyHr,
	getCompanyApplications
);
router
	.route('/:companyId')
	.delete(iscompanyHr, deleteCompany)
	.patch(
		iscompanyHr,
		checkCompanyNameAndEmailUniqueness,
		validateResource(updateCompanyValidation),
		updateCompany
	)
	.get(iscompanyHr, getCompanyData);

export default router;
