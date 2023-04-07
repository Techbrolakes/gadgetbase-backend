import express from 'express';
import * as UserControllers from '../controllers/user.controller';
import * as UserValidations from '../validations/user.validation';
import * as ProfileValidations from '../validations/profile.validation';
import * as UserProfile from '../controllers/profile.controller';
import auth from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', UserValidations.registerUser, UserControllers.registerUser);
router.post('/verify-email', UserValidations.VerifyEmail, UserControllers.verifyEmail);
router.post('/resend', UserValidations.resendVerification, UserControllers.resendVerification);
router.post('/login', UserValidations.loginUser, UserControllers.loginUser);
router.post('/recover', UserValidations.recoverPassword, UserControllers.recoverPassword);
router.post('/verify-otp', UserValidations.verifyOTP, UserControllers.verifyOTP);
router.post('/reset-password', UserValidations.resetPassword, UserControllers.resetPassword);

// Profile Routes - User Management
router.get('/get', auth, UserProfile.getAllUsers);
router.put('/edit', auth, UserProfile.editProfile);
router.post('/reset', auth, ProfileValidations.validateResetPassword, UserProfile.resetPassword);

export default router;
