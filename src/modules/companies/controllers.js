import {isResourceOwner} from '../auth/helpers.js';
import Job from '../jobs/models.js';
import Company from './models.js';
import Application from '../applications/models.js';
import asyncHandler from 'express-async-handler';

/**
 * Get applications for a specific company.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the request.
 * @param {string} req.user.id - The ID of the user.
 * @param {Object} req.params - The parameters from the request.
 * @param {string} req.params.companyId - The ID of the company.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getCompanyApplications = asyncHandler(async (req, res) => {
	const {id} = req.user;
	const {companyId} = req.params;
	const company = await Company.findById(companyId);
	if (!company) {
		return res.status(404).json({error: 'Company not found'});
	}

	if (!(await isResourceOwner(id, company.companyHR.toString()))) {
		return res.status(400).json({error: 'you are not the user owner'});
	}
	const jobs = await Job.find({addedBy: company.companyHR});
	if (jobs.length === 0) {
		return res.status(404).json({error: 'No jobs found for this company'});
	}
	const jobApplications = [];

	for (const job of jobs) {
		const applications = await Application.find({jobId: job.id}).populate(
			'userId'
		);
		jobApplications.push({
			applications,
		});
	}

	res.status(200).json({data: jobApplications});
});

/**
 * Get the jobs created by a company hr for a specific company.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request.
 * @param {string} req.params.companyId - The ID of the company.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getCompanyData = asyncHandler(async (req, res) => {
	const {companyId} = req.params;
	const company = await Company.findById(companyId);
	if (!company) {
		return res.status(404).json({error: 'Company not found'});
	}

	const jobs = await Job.find({addedBy: company.companyHR});
	res.status(200).json({data: jobs});
});

/**
 * Search for a company by name.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters from the request.
 * @param {string} req.query.companyName - The name of the company to search for.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const searchForCompany = asyncHandler(async (req, res) => {
	const {companyName} = req.query;
	const company = await Company.findOne({companyName});
	if (!company) {
		return res
			.status(404)
			.json({error: 'no company found with the given name'});
	}
	res.status(200).json({data: company});
});
/**
 * Update a company's details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters from the request.
 * @param {string} req.params.companyId - The ID of the company.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.companyName - The new name of the company.
 * @param {string} req.body.description - The new description of the company.
 * @param {string} req.body.industry - The new industry of the company.
 * @param {string} req.body.address - The new address of the company.
 * @param {number} req.body.numberOfEmployees - The new number of employees in the company.
 * @param {string} req.body.companyEmail - The new email of the company.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const updateCompany = asyncHandler(async (req, res) => {
	const {companyId} = req.params;
	const {id} = req.user;
	const {
		companyName,
		description,
		industry,
		address,
		numberOfEmployees,
		companyEmail,
		companyHR,
	} = req.body;

	const company = await Company.findById(companyId);
	if (!company) {
		return res.status(404).json({error: 'company doesnt exist'});
	}

	if (!(await isResourceOwner(id, company.companyHR.toString()))) {
		return res.status(400).json({error: 'you are not the company owner'});
	}
	const updatedCompany = await Company.findByIdAndUpdate(
		companyId,
		{
			companyName,
			description,
			industry,
			address,
			numberOfEmployees,
			companyEmail,
			companyHR,
		},
		{new: true}
	);
	res.status(200).json({data: updatedCompany});
});

/**
 * Deletes a company by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.companyId - The ID of the company to delete.
 * @returns {Object} - A JSON response indicating the result of the deletion.
 */
export const deleteCompany = asyncHandler(async (req, res) => {
	const {companyId} = req.params;
	const {id} = req.user;
	const company = await Company.findById(companyId);
	if (!company) {
		return res.status(404).json({error: 'company doesnt exist'});
	}
	if (!(await isResourceOwner(id, company.companyHR.toString()))) {
		return res.status(400).json({error: 'you are not the company owner'});
	}
	await Company.findByIdAndDelete(companyId);
	res.status(200).json({message: 'company deleted successfully'});
});

/**
 * Creates a new application.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.jobId - The ID of the job.
 * @param {string} req.body.userId - The ID of the user.
 * @param {Array<string>} req.body.userTechSkills - The technical skills of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A promise that resolves to the created application object.
 */
export const createCompany = asyncHandler(async (req, res) => {
	const {
		companyName,
		description,
		industry,
		address,
		numberOfEmployees,
		companyEmail,
		companyHR,
	} = req.body;

	const company = await Company.create({
		companyName,
		description,
		industry,
		address,
		numberOfEmployees,
		companyEmail,
		companyHR,
	});
	res.status(200).json({data: company});
});
