import j from 'joi';

export const applicationValidation = j.object({
	body: j.object({
		jobId: j.string().required(),
		userId: j.string().required(),
		userTechSkills: j.array(j.string()),
		userSoftSkills: j.array(j.string()),
	}),
});
