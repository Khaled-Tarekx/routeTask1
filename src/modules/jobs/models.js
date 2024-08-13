import {Schema, Types, model} from 'mongoose';

const jobSchema = new Schema({
	jobTitle: {type: String, required: true},
	jobLocation: {
		type: String,
		default: 'onsite',
		enum: {
			values: ['onsite', 'remotely', 'hybrid'],
			message: '{VALUE} is not supported',
		},
	},
	workingTime: {
		type: String,
		default: 'full-time',
		enum: {
			values: ['part-time', 'full-time'],
			message: '{VALUE} is not supported',
		},
	},
	seniorityLevel: {
		type: String,
		default: 'onsite',
		enum: {
			values: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
			message: '{VALUE} is not supported',
		},
	},
	jobDescription: {type: String, required: true},
	technicalSkills: [
		{
			type: String,
			required: true,
		},
	],
	softSkills: [
		{
			type: String,
			required: true,
		},
	],
	addedBy: {type: Types.ObjectId, ref: 'user', required: true},
});

jobSchema.pre(
	'remove',
	async function (next) {
		const jobId = this._id;
		try {
			await Application.deleteMany({jobId});
			next();
		} catch (err) {
			next(err);
		}
	},
	{timestamps: true}
);

const Job = model('job', jobSchema);
export default Job;
