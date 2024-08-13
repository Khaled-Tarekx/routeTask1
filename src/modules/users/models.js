import {Schema, model} from 'mongoose';
import Job from '../jobs/models.js';
import Application from '../applications/models.js';

const userSchema = new Schema(
	{
		firstName: String,
		lastName: String,

		username: {
			type: String,
			default: function () {
				return this.firstName + '' + this.lastName;
			},
		},

		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {type: String, minLength: 5},
		recoveryEmail: {
			type: String,
		},
		dateOfBirth: {type: Date, format: 'YYYY-MM-DD', required: true},
		mobileNumber: {type: String, unique: true, maxLength: 11},
		roles: {
			type: String,
			default: 'user',
			enum: {
				values: ['user', 'Company_HR'],
				message: '{VALUE} is not supported',
			},
		},

		status: {
			type: String,
			default: 'offline',
			enum: {
				values: ['online', 'offline'],
				message: '{VALUE} is not supported',
			},
		},
		otp: {
			code: {type: String, maxLength: 6},
			expiresAt: {type: Date},
		},
	},
	{timestamps: true}
);

//TODO: needs to be more cascading  companies
userSchema.pre('remove', async function (next) {
	const userId = this._id;
	try {
		await Job.deleteMany({addedBy: userId});
		await Application.deleteMany({userId});

		next();
	} catch (err) {
		next(err);
	}
});

const User = model('user', userSchema);
export default User;
