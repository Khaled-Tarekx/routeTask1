import asyncHandler from 'express-async-handler';

export const createCustomFilter = async (query) => {
	const {
		workingTime,
		jobLocation,
		seniorityLevel,
		jobTitle,
		technicalSkills,
	} = query;

	let customFilter = {};

	if (workingTime) customFilter.workingTime = workingTime;
	if (jobLocation) customFilter.jobLocation = jobLocation;
	if (seniorityLevel) customFilter.seniorityLevel = seniorityLevel;
	if (jobTitle) customFilter.jobTitle = jobTitle;
	if (technicalSkills) customFilter.technicalSkills = technicalSkills;

	return customFilter;
};

export const getAvailableData = async (company) => {
	let companyData = {};

	if (company) {
		if (company.companyName) companyData.companyName = company.companyName;
		if (company.description) companyData.description = company.description;
		if (company.industry) companyData.industry = company.industry;
		if (company.address) companyData.address = company.address;
		if (company.numberOfEmployees)
			companyData.numberOfEmployees = company.numberOfEmployees;
		if (company.companyEmail) companyData.companyEmail = company.companyEmail;
		if (company.companyHR) companyData.companyHR = company.companyHR;
	}
	return companyData;
};
