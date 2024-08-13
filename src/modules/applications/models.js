import {Schema, Types, model} from 'mongoose';

const applicationSchema = new Schema(
	{
		jobId: {type: Types.ObjectId, ref: 'job', required: true},
		userId: {type: Types.ObjectId, ref: 'user', required: true},
		userTechSkills: [{type: String, required: true}],
		userSoftSkills: [{type: String, required: true}],
		userResume: {type: String, required: true}, // TODO: ( must be pdf , upload this pdf on cloudinary )
	},
	{timestamps: true}
);

const Application = model('application', applicationSchema);
export default Application;
