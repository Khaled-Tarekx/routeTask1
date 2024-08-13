import express from 'express';
import {validateResource} from '../auth/middlewares.js';
const router = express.Router();
import {
	getUserByID,
	getUsers,
	updateUser,
	deleteUser,
	getUserByRecoveryEmail,
	getMyUser,
	updatePassword,
	generateOtp,
} from './controllers.js';
import {
	recoveryEmailValidation,
	updatePasswordValidation,
	updateUserValidation,
} from './validation.js';

router.route('/').get(getUsers);
router.get('/me', getMyUser);
router.get(
	'/recovery-email',
	validateResource(recoveryEmailValidation),
	getUserByRecoveryEmail
);
router.patch(
	'/update-user',
	validateResource(updateUserValidation),
	updateUser
);

router.patch(
	'/update-password',
	validateResource(updatePasswordValidation),
	updatePassword
);
router.post('/generate-otp', generateOtp);
router.delete('/delete-user', deleteUser);

router.get('/:id', getUserByID);

export default router;
