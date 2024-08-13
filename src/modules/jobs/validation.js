import j from 'joi';
import User from '../users/models.js';
import {objectId} from '../companies/helpers.js';

export const jobValidation = j.object({
	body: j.object({
		jobTitle: j.string().required(),
		jobLocation: j
			.string()
			.valid('onsite', 'remotly', 'hybrid')
			.messages({
				'any.only':
					'Role must be one of the following: onsite, remotly, hybrid',
			})
			.required(),
		workingTime: j
			.string()
			.valid('part-time', 'full-time')
			.messages({
				'any.only': 'Role must be one of the following: part-time, full-time',
			})
			.required(),
		seniorityLevel: j
			.string()
			.valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO')
			.messages({
				'any.only': 'Role must be one of the following: part-time, full-time',
			})
			.required(),
		jobDescription: j.string().required(),
		technicalSkills: j.string().required(),
		softSkills: j.string().required(),
		addedBy: j
			.string()
			.custom(async (value, helpers) => {
				const user = await User.findById(value);
				if (!user) {
					return helpers.message('User not found');
				}
				if (user.roles !== 'Company_HR') {
					return helpers.message('User must be a Company_HR to create a job');
				}
				return value;
			})
			.required(),
	}),
});

export const updateJobValidation = j.object({
	body: j.object({
		jobTitle: j.string(),
		jobLocation: j.string().valid('onsite', 'remotly', 'hybrid').messages({
			'any.only':
				'Role must be one of the following: onsite, remotly, hybrid',
		}),
		workingTime: j.string().valid('part-time', 'full-time').messages({
			'any.only': 'Role must be one of the following: part-time, full-time',
		}),
		seniorityLevel: j
			.string()
			.valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO')
			.messages({
				'any.only': 'Role must be one of the following: part-time, full-time',
			}),
		jobDescription: j.string(),
		technicalSkills: j.string(),
		softSkills: j.string(),
	}),
	params: j.object({
		jobId: objectId,
	}),
});

export const jobSearchValidation = j.object({
	query: j.object({
		jobLocation: j.string().valid('onsite', 'remotly', 'hybrid').messages({
			'any.only':
				'Role must be one of the following: onsite, remotly, hybrid',
		}),
		workingTime: j.string().valid('part-time', 'full-time').messages({
			'any.only': 'Role must be one of the following: part-time, full-time',
		}),
		seniorityLevel: j
			.string()
			.valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO')
			.messages({
				'any.only': 'Role must be one of the following: part-time, full-time',
			}),
		jobTitle: j.string(),
		technicalSkills: j.string(),
	}),
});
