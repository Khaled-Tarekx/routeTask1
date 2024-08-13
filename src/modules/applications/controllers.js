import Application from './models.js';
import {fileTypeFromBuffer} from 'file-type';
import cloudinary from '../../cloudinary/setup.js';
import asyncHandler from 'express-async-handler';
import fs from 'fs';

/**
 * Handles the job application process by uploading a resume and creating a job application record.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.file - The uploaded file containing the user's resume.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.jobId - The ID of the job to which the user is applying.
 * @param {string} req.body.userId - The ID of the user applying for the job.
 * @param {Array<string>} req.body.userTechSkills - The technical skills of the user.
 * @param {Array<string>} req.body.userSoftSkills - The soft skills of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 * @throws {Object} 400 - If no file is uploaded or if the file type is invalid.
 * @throws {Object} 400 - If there is an error uploading the file to Cloudinary.
 * @throws {Object} 200 - If the job application is created successfully.
 */
export const applyToJob = asyncHandler(async (req, res) => {
	try {
		const userResume = req.file;
		const {jobId, userId, userTechSkills, userSoftSkills} = req.body;

		if (!userResume || !userResume.path) {
			return res
				.status(400)
				.json({error: 'No file uploaded or file path is missing'});
		}
		const fileBuffer = fs.readFileSync(userResume.path);

		const fileTypeResult = await fileTypeFromBuffer(fileBuffer);

		if (!fileTypeResult || fileTypeResult.mime !== 'application/pdf') {
			return res
				.status(400)
				.json({error: 'Invalid file type, only PDF is allowed'});
		}
		const fileName = userResume.originalname.split('.')[0];
		const fileExtension = 'pdf';

		cloudinary.uploader
			.upload_stream({public_id: `${fileName}`}, async (err, result) => {
				if (err) {
					console.error('Cloudinary upload error:', err.message);

					return res.status(400).json(err.message);
				}
				const application = await Application.create({
					jobId,
					userId,
					userTechSkills,
					userSoftSkills,
					userResume: result.secure_url,
				});

				res.status(200).json({
					application,
					fileName: `${fileName}.${fileExtension}`,
				});
			})
			.end(fileBuffer);
	} catch (err) {
		res.status(400).json(err.message);
	}
});
