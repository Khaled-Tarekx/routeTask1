import express from 'express';
import uploads from '../../upload/uploads.js';

const router = express.Router();
import {isUser} from '../auth/middlewares.js';
import {applyToJob} from './controllers.js';

router.post(
	'/apply-to-job',
	isUser,
	uploads.single('userResume'),
	applyToJob
);

export default router;
