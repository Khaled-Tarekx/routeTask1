import express from 'express';
import {
	getJobsWithCompanies,
	createJob,
	getJobsForCompany,
	searchForJobs,
	deleteJob,
	updateJob,
} from './controllers.js';
import {iscompanyHr, validateResource} from '../auth/middlewares.js';
import {
	jobSearchValidation,
	jobValidation,
	updateJobValidation,
} from './validation.js';

const router = express.Router();

router
	.route('/')
	.get(getJobsWithCompanies)
	.post(iscompanyHr, validateResource(jobValidation), createJob);

router.get('/company/:id', getJobsForCompany);

router.get(
	'/search',
	iscompanyHr,
	validateResource(jobSearchValidation),
	searchForJobs
);

router
	.route('/:jobId')
	.delete(iscompanyHr, deleteJob)
	.patch(iscompanyHr, validateResource(updateJobValidation), updateJob);

export default router;
