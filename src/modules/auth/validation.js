import j from 'joi';

export const registerValidation = j.object({
	body: j.object({
		firstName: j.string().required(),
		lastName: j.string().required(),
		username: j.string().default(function (parent) {
			return parent.firstName + '' + parent.lastName;
		}),
		email: j
			.string()
			.required()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
		recoveryEmail: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}})
			.invalid(j.ref('email'))
			.messages({
				'any.invalid':
					'Recovery email should not be the same as the main email',
			}),
		password: j.string().min(5),
		confirmPassword: j.ref('password'),
		dateOfBirth: j.date().iso().required(),
		mobileNumber: j.string().pattern(/^\d+$/).min(11).max(11).required(),
		roles: j.string().valid('user', 'Company_HR').messages({
			'any.only': 'Role must be one of the following: user, Company_HR',
		}),
		status: j.string().valid('online', 'offline').messages({
			'any.only': 'Status must be one of the following: online, offline',
		}),
	}),
});

export const loginValidation = j.object({
	body: j.object({
		email: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
		recoveryEmail: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}})
			.invalid(j.ref('email'))
			.messages({
				'any.invalid':
					'Recovery email should not be the same as the main email',
			}),
		mobileNumber: j.string().pattern(/^\d+$/),
		password: j.string().min(5).required(),
	}),
});

export const forgetPasswordValidation = j.object({
	body: j.object({
		email: j
			.string()
			.required()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
		password: j.string().min(5).required(),
		confirmPassword: j
			.string()
			.valid(j.ref('password'))
			.required()
			.messages({'any.only': 'Passwords do not match'}),
		otpCode: j.string().max(6).required(),
	}),
});
