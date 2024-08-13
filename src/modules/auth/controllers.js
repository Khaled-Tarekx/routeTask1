import {compare} from 'bcrypt';
import User from '../users/models.js';
import {
	validateOTP,
	hashPassword,
	findUserByEmailAndNumber,
} from './helpers.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

/**
 * Registers a new user with the provided details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing user details.
 * @param {string} req.body.firstName - The first name of the user.
 * @param {string} req.body.lastName - The last name of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password for the user account.
 * @param {Array<string>} req.body.roles - The roles assigned to the user.
 * @param {string} req.body.recoveryEmail - The recovery email address for the user.
 * @param {string} req.body.dateOfBirth - The date of birth of the user.
 * @param {string} req.body.mobileNumber - The mobile number of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
export const register = asyncHandler(async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			roles,
			recoveryEmail,
			dateOfBirth,
			mobileNumber,
		} = req.body;
		const user = await User.create({
			firstName,
			lastName,
			email,
			password,
			roles,
			recoveryEmail,
			dateOfBirth,
			mobileNumber,
		});
		res.status(201).json({message: `user created successfully`, user});
	} catch (err) {
		res.status(500).json({message: `error signing-up ${err}`});
	}
});

/**
 * Handles user login by verifying credentials and generating a JWT token.
 *
 * @async
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} [req.body.email] - The email of the user. Either `email`, `mobileNumber`, or `recoveryEmail` is required.
 * @param {string} [req.body.mobileNumber] - The mobile number of the user. Either `email`, `mobileNumber`, or `recoveryEmail` is required.
 * @param {string} [req.body.recoveryEmail] - The recovery email of the user. Either `email`, `mobileNumber`, or `recoveryEmail` is required.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * @throws {Error} Will throw an error if the credentials are incorrect or if the user is not found.
 */
export const login = asyncHandler(async (req, res) => {
	const {password} = req.body;
	const correctUser = await findUserByEmailAndNumber(req.body);
	if (!correctUser || !compare(password, correctUser.password)) {
		return res.status(400).json({message: `email or password is incorrect`});
	}
	const token = jwt.sign(
		{id: correctUser.id, roles: correctUser.roles},
		process.env.SECRET_KEY
	);
	correctUser.status = 'online';
	correctUser.save();
	res.status(201).json({message: `user logged in successfully`, token});
});

/**
 * Handles the forget password functionality.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.newPassword - The new password.
 * @param {string} req.body.confirmPassword - The confirmation of the new password.
 * @param {string} req.body.otpCode - The OTP code for validation.
 * @param {string} req.body.email - The email of the user.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const forgetPassword = asyncHandler(async (req, res) => {
	const {newPassword, confirmPassword, otpCode, email} = req.body;
	const user = await User.findOne({email});

	if (!user) {
		return res.status(404).json({error: 'User not found'});
	}
	const isValid = await validateOTP(user.id, otpCode);
	if (!isValid) {
		return res
			.status(400)
			.json({error: 'your otp is either not correct or expired'});
	}
	if (newPassword !== confirmPassword) {
		return res
			.status(400)
			.json({error: 'password and confirm password should match'});
	}
	const hashedPassword = await hashPassword(newPassword);
	const updatedUser = await User.findByIdAndUpdate(
		user.id,
		{password: hashedPassword},
		{new: true}
	).select('-password -otp');
	res.status(201).json({
		message: `new user password has been set successfully`,
		updatedUser,
	});
});
