import asyncHandler from 'express-async-handler';
import {isResourceOwner, hashPassword, generateOTP} from '../auth/helpers.js';
import User from './models.js';

/**
 * Asynchronous handler to get all users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.status(200).json({data: users});
});

/**
 * Asynchronous handler to get a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.id - The identifier of the user to be retrieved.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getUserByID = asyncHandler(async (req, res) => {
	const {id} = req.params;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({error: 'user doesnt exist'});
	}
	res.status(200).json({data: user});
});

/**
 * Asynchronous handler to get users by recovery email.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.recoveryEmail - The recovery email to search for users.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getUserByRecoveryEmail = asyncHandler(async (req, res) => {
	const {recoveryEmail} = req.body;
	const users = await User.find({recoveryEmail});
	if (!users) {
		return res.status(404).json({
			error: 'users assosiated with this recovery email dont exist',
		});
	}
	res.status(200).json({data: users, count: users.length});
});

/**
 * Asynchronous handler to get the current user's details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing user details.
 * @param {string} req.user.id - The identifier of the current user.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const getMyUser = asyncHandler(async (req, res) => {
	const {id} = req.user;
	const myUser = await User.findById(id);
	if (!myUser) {
		return res.status(404).json({error: 'user doesnt exist'});
	}
	if (!isResourceOwner(id, myUser.id)) {
		return res.status(400).json({error: 'you are not the user owner'});
	}
	res.status(200).json({data: myUser});
});

/**
 * Asynchronous handler to update the current user's details.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing user details.
 * @param {string} req.user.id - The identifier of the current user.
 * @param {Object} req.body - The body of the request containing user details to be updated.
 * @param {string} req.body.email - The new email of the user.
 * @param {string} req.body.mobileNumber - The new mobile number of the user.
 * @param {string} req.body.recoveryEmail - The new recovery email of the user.
 * @param {string} req.body.dateOfBirth - The new date of birth of the user.
 * @param {string} req.body.lastName - The new last name of the user.
 * @param {string} req.body.firstName - The new first name of the user.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const updateUser = asyncHandler(async (req, res) => {
	const {id} = req.user;
	const {
		email,
		mobileNumber,
		recoveryEmail,
		dateOfBirth,
		lastName,
		firstName,
	} = req.body;

	const mobileNumberExists = await User.findOne({mobileNumber});

	if (mobileNumberExists) {
		return res
			.status(400)
			.json({error: 'you already registered with this mobile number'});
	}

	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({error: 'user not found'});
	}

	if (!isResourceOwner(id, user.id)) {
		return res.status(400).json({error: 'you are not the user owner'});
	}
	const updatedUser = await User.findByIdAndUpdate(
		user.id,
		{email, mobileNumber, recoveryEmail, dateOfBirth, lastName, firstName},
		{new: true}
	).select('-password');
	if (!updatedUser) {
		return res.status(404).json({error: 'user doesnt exist'});
	}

	res.status(200).json({data: updatedUser});
});

/**
 * Asynchronous handler to delete the current user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing user details.
 * @param {string} req.user.id - The identifier of the current user.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const deleteUser = asyncHandler(async (req, res) => {
	const {id} = req.user;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({error: 'user doesnt exist'});
	}
	if (!isResourceOwner(id, user.id)) {
		return res.status(400).json({error: 'you are not the user owner'});
	}
	await User.findByIdAndDelete(user.id);

	res.status(200).json({message: 'user deleted successfully'});
});

/**
 * Asynchronous handler to update the current user's password.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing user details.
 * @param {string} req.user.id - The identifier of the current user.
 * @param {Object} req.body - The body of the request containing password details.
 * @param {string} req.body.password - The new password of the user.
 * @param {string} req.body.confirmPassword - The confirmation of the new password.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const updatePassword = asyncHandler(async (req, res) => {
	const {id} = req.user;
	const {password, confirmPassword} = req.body;
	if (password !== confirmPassword) {
		return res
			.status(400)
			.json({error: 'password and confirm password should match'});
	}
	const hashedPassword = await hashPassword(password);

	const user = await User.findByIdAndUpdate(
		id,
		{hashedPassword},
		{new: true}
	);
	if (!user) {
		return res.status(404).json({error: 'user doesnt exist'});
	}
	if (!isResourceOwner(id, user.id)) {
		return res.status(400).json({error: 'you are not the user owner'});
	}

	res.status(200).json({message: 'user password updated successfully'});
});

/**
 * Asynchronous handler to generate an OTP for the current user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object containing user details.
 * @param {string} req.user.id - The identifier of the current user.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export const generateOtp = asyncHandler(async (req, res) => {
	const OTP = await generateOTP();
	const convertedOTP = OTP.toString();
	const expiresIn = 10 * 60 * 1000;
	const {id} = req.user;
	const user = await User.findByIdAndUpdate(
		id,
		{
			otp: {
				expiresAt: new Date(Date.now() + expiresIn),
				code: convertedOTP,
			},
		},
		{new: true}
	);

	if (!user) {
		return res.status(404).json({error: 'user doesnt exist'});
	}

	if (!isResourceOwner(id, user.id)) {
		return res.status(400).json({error: 'you are not the user owner'});
	}

	res.status(201).json({otpCode: convertedOTP});
});
