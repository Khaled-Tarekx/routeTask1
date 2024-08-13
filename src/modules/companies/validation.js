import j from 'joi';
import {objectId} from './helpers.js';

export const companyValidation = j.object({
	body: j.object({
		companyName: j.string(),
		description: j.string(),
		industry: j.string(),
		address: j.string(),
		numberOfEmployees: j.number().min(11).max(20),
		companyEmail: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}})
			.required(),
		companyHR: j.string().required(),
	}),
});

export const updateCompanyValidation = j.object({
	body: j.object({
		companyName: j.string(),
		description: j.string(),
		industry: j.string(),
		address: j.string(),
		numberOfEmployees: j.number().min(11).max(20),
		companyEmail: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
		companyHR: j.string(),
	}),
	params: j.object({
		companyId: objectId,
	}),
});
