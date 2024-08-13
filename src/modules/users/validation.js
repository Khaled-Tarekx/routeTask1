import j from 'joi';

export const recoveryEmailValidation = j.object({
	body: j.object({
		recoveryEmail: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
	}),
});

export const updateUserValidation = j.object({
	body: j.object({
		email: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
		recoveryEmail: j
			.string()
			.email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}})
			.invalid(j.ref('email')),
		dateOfBirth: j.date(),
		mobileNumber: j.string().max(11),
		firstName: j.string(),
		lastName: j.string(),
	}),
});

export const updatePasswordValidation = j.object({
	body: j.object({
		password: j.string().min(5).required(),
		confirmPassword: j
			.string()
			.valid(j.ref('password'))
			.required()
			.messages({'any.only': 'Passwords do not match'}),
	}),
});
