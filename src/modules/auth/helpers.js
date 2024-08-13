import asyncHandler from 'express-async-handler';
import User from '../users/models.js';
import {hash, genSalt} from 'bcrypt';

export const isResourceOwner = async (userId, resourceOwnerId) => {
	return userId === resourceOwnerId;
};

export const generateOTP = async () =>
	Math.floor(100000 + Math.random() * 900000);

export const validateOTP = async (userId, otpCode) => {
	const user = await User.findById(userId);
	if (!user || !user.otp || !user.otp.expiresAt) return false;
	if (Date.now() > user.otp.expiresAt.getTime()) {
		user.otp.code = null;
		user.otp.expiresAt = null;
		await user.save();
		return false;
	}

	try {
		const isMatch = user.otp.code === otpCode;
		if (isMatch) {
			user.otp.code = null;
			user.otp.expiresAt = null;
			await user.save();
		}
		return isMatch;
	} catch (err) {
		return false;
	}
};

export const hashPassword = async (password) => {
	try {
		const salt = await genSalt(10);
		return hash(password, salt);
	} catch (err) {
		throw new Error('error hashing password', err);
	}
};

export const findUserByEmailAndNumber = async (body) => {
	let correctUser = null;

	if (body.email) {
		correctUser = await User.findOne({email: body.email});
	}

	if (!correctUser && body.mobileNumber) {
		correctUser = await User.findOne({
			mobileNumber: body.mobileNumber,
		});
	}
	return correctUser;
};
