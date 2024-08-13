import {isResourceOwner} from '../auth/helpers.js';
import Job from './models.js';
import Company from '../companies/models.js';
import asyncHandler from 'express-async-handler';
import {createCustomFilter, getAvailableData} from './helpers.js';

/**
 * Get jobs for a specific company.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request.
 * @param {string} req.params.id - The ID of the company.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getJobsForCompany = asyncHandler(async (req, res) => {
	const {id} = req.params;
	const company = await Company.findById(id);
	if (!company) {
		return res.status(404).json({error: 'Company not found'});
	}

	const jobs = await Job.find({addedBy: company.companyHR});
	if (jobs.length === 0) {
		return res.status(200).json({message: 'No jobs found for this company'});
	}

	res.status(200).json({data: jobs});
});

/**
 * Get jobs along with their respective companies.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getJobsWithCompanies = asyncHandler(async (req, res) => {
	const jobs = await Job.find({});
	const jobsWithCompanies = [];

	for (const job of jobs) {
		const company = await Company.findOne({companyHR: job.addedBy});
		const companyData = await getAvailableData(company);
		const jobWithCompany = {
			...job.toObject(),
			company: companyData,
		};
		jobsWithCompanies.push(jobWithCompany);
	}
	res.status(200).json({data: jobsWithCompanies});
});

/**
 * Asynchronous handler to search for jobs based on custom filters.
 *
 * @param {Object} req - The request object containing query parameters for filtering jobs.
 * @param {Object} res - The response object used to send back the appropriate HTTP response.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 */
export const searchForJobs = asyncHandler(async (req, res) => {
	const customFilter = await createCustomFilter(req.query);
	if (Object.keys(customFilter).length === 0) {
		return res.status(400).json({error: 'please provide some filters'});
	}

	const jobs = await Job.find(customFilter);

	if (jobs.length === 0) {
		return res
			.status(404)
			.json({error: 'no jobs found with the given filters'});
	}
	res.status(200).json({data: jobs});
});

/**
 * Updates a job listing with the provided details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing the user ID.
 * @param {string} req.user.id - The ID of the user making the request.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.jobId - The ID of the job to be updated.
 * @param {Object} req.body - The request body containing job details.
 * @param {string} req.body.jobTitle - The title of the job.
 * @param {string} req.body.jobLocation - The location of the job.
 * @param {string} req.body.workingTime - The working time for the job.
 * @param {string} req.body.seniorityLevel - The seniority level required for the job.
 * @param {string} req.body.jobDescription - The description of the job.
 * @param {Array<string>} req.body.technicalSkills - The technical skills required for the job.
 * @param {Array<string>} req.body.softSkills - The soft skills required for the job.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const updateJob = asyncHandler(async (req, res) => {
	const {id} = req.user;
	console.log(id);
	const {jobId} = req.params;
	const {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	} = req.body;

	const job = await Job.findById(jobId);
	if (!job) {
		return res.status(404).json({error: 'job doesnt exist'});
	}
	if (!(await isResourceOwner(id, job.addedBy.toString()))) {
		return res.status(400).json({error: 'you are not the job creator'});
	}
	const updatedJob = await Job.findByIdAndUpdate(
		job.id,
		{
			jobTitle,
			jobLocation,
			workingTime,
			seniorityLevel,
			jobDescription,
			technicalSkills,
			softSkills,
		},
		{new: true}
	);
	res.status(200).json({data: updatedJob});
});

/**
 * Asynchronous handler to delete a job entry.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing user details.
 * @param {string} req.user.id - The identifier of the user making the request.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.jobId - The identifier of the job to be deleted.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const deleteJob = asyncHandler(async (req, res) => {
	const {id} = req.user;
	const {jobId} = req.params;

	const job = await Job.findById(jobId);
	if (!job) {
		return res.status(404).json({error: 'job doesnt exist'});
	}
	if (!(await isResourceOwner(id, job.addedBy.toString()))) {
		return res.status(400).json({error: 'you are not the job creator'});
	}
	await Job.findByIdAndDelete(job.id);
	res.status(200).json({message: 'job deleted successfully'});
});

/**
 * Asynchronous handler to create a new job entry.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing job details.
 * @param {string} req.body.jobTitle - The title of the job.
 * @param {string} req.body.jobLocation - The location of the job.
 * @param {string} req.body.workingTime - The working time for the job.
 * @param {string} req.body.seniorityLevel - The seniority level required for the job.
 * @param {string} req.body.jobDescription - The description of the job.
 * @param {Array<string>} req.body.technicalSkills - The technical skills required for the job.
 * @param {Array<string>} req.body.softSkills - The soft skills required for the job.
 * @param {string} req.body.addedBy - The identifier of the user who added the job.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const createJob = asyncHandler(async (req, res) => {
	const {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
		addedBy,
	} = req.body;

	const job = await Job.create({
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
		addedBy,
	});
	res.status(200).json({data: job});
});
