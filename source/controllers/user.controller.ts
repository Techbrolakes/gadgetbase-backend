import { Response } from 'express';
import { ExpressRequest } from '../server';
import { IRegister, IVerifyMail } from '../interfaces/user.interface';
import ResponseHandler from '../utils/response-handler';
import userService from '../services/user.service';
import { Types } from 'mongoose';
import UtilsFunc from '../utils';
import { sendPasswordRecoveryEmail, sendWelcomeEmail } from '../services/mail.service';
import otpService from '../services/otp.service';
import bcrypt from 'bcrypt';

/******
 *
 *
 * Reset Password
 */

export const resetPassword = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    const { token, new_password, confirm_password } = req.body;

    try {
        const verify_token: any = await UtilsFunc.verifyToken(token);

        const user = await userService.getByEmail({ email: verify_token.email });
        if (!user) {
            return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        }
        if (!user.verified_email) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Email is not verified already' });
        }
        if (user.is_disabled) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }

        if (new_password !== confirm_password) {
            return ResponseHandler.sendErrorResponse({ res, code: 400, error: `Passwords mismatch` });
        }
        const hash = bcrypt.hashSync(new_password, 10);
        await userService.atomicUpdate(user._id, { $set: { password: hash } });
        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: 'Your password has been successfully updated',
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Verify OTP
 */
export const verifyOTP = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    const { email, otp }: { email: string; otp: number } = req.body;
    try {
        const user = await userService.getByEmail({ email: email.toLowerCase() });
        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.is_disabled) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const verifyOtp = await otpService.verifyOtp({ otp, user_id: user._id });
        if (!verifyOtp.status) {
            return ResponseHandler.sendErrorResponse({
                res,
                code: 400,
                error: verifyOtp.message,
            });
        }
        const token = await UtilsFunc.generateToken({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
        const data = { token };
        return ResponseHandler.sendSuccessResponse({ res, code: 200, message: 'OTP Verification successful.', data });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Recover Password
 */

export const recoverPassword = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    try {
        const { email }: { email: string } = req.body;
        const user = await userService.getByEmail({ email: email.toLowerCase() });
        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.is_disabled) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const otp = await UtilsFunc.generateOtp({ user_id: user._id });
        await sendPasswordRecoveryEmail({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'GadgetBase Password Recovery',
        });
        return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: 'A reset email has been sent to ' + email + '.',
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Login
 */

export const loginUser = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    const { email, password } = req.body;
    try {
        const user = await userService.getByEmail({ email: email.toLowerCase() });
        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (!user.verified_email) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: 'Email is not verified yet',
                data: {
                    verified_email: false,
                },
            });
        }
        if (user.is_disabled) {
            return ResponseHandler.sendErrorResponse({ res, code: 403, error: 'User Account is disabled' });
        }
        const result = bcrypt.compareSync(password, user?.password!);
        if (!result) {
            return ResponseHandler.sendErrorResponse({
                res,
                code: 400,
                error: 'Password is incorrect',
            });
        }
        const token = await UtilsFunc.generateToken({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });

        const data = { token, ...user };
        return ResponseHandler.sendSuccessResponse({ res, code: 200, message: 'Login successful', data });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Resend Verification
 */

export const resendVerification = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
    const { email }: { email: string } = req.body;

    try {
        const user = await userService.getByEmail({ email: email.toLowerCase() });
        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.verified_email) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Email is verified already' });
        }
        const otp = await UtilsFunc.generateOtp({ user_id: user._id });
        await sendWelcomeEmail({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'Welcome to GadgetBase',
        });

        return ResponseHandler.sendSuccessResponse({
            message: `A verification mail has been sent to ${user.email}`,
            code: 201,
            res,
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Verify Email
 */
export const verifyEmail = async (req: ExpressRequest, res: Response) => {
    const { email, otp }: IVerifyMail = req.body;
    try {
        const user = await userService.getByEmail({ email: email.toLowerCase() });

        if (!user) return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Email does not exist' });
        if (user.verified_email) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Email is verified already' });
        }
        if (user.is_disabled) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: 'Your account has been disabled' });
        }
        const verifyOtp = await otpService.verifyOtp({ otp, user_id: user._id });
        if (!verifyOtp.status) {
            return ResponseHandler.sendErrorResponse({ res, code: 400, error: verifyOtp.message });
        }
        const token = await UtilsFunc.generateToken({
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        });

        await userService.atomicUpdate(user._id, {
            $set: {
                verified_email: true,
                verified_email_at: new Date(),
            },
        });

        const data = {
            token,
            ...user,
        };

        return ResponseHandler.sendSuccessResponse({ res, code: 201, message: 'Email verified successfully', data });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};

/******
 *
 *
 * Register Email
 */
export const registerUser = async (req: ExpressRequest, res: Response): Promise<Response> => {
    const { first_name, last_name, email, password, confirm_password, phone_number }: IRegister = req.body;

    try {
        const existingUser = await userService.getByEmail({ email: email.toLowerCase() });
        if (existingUser) {
            return ResponseHandler.sendErrorResponse({ res, code: 409, error: `${email} is already taken` });
        }
        if (password !== confirm_password) {
            return ResponseHandler.sendErrorResponse({ res, code: 400, error: 'Passwords mismatch' });
        }
        const user = await userService.createUser({
            first_name: first_name.charAt(0).toUpperCase() + first_name.slice(1),
            last_name: last_name.charAt(0).toUpperCase() + last_name.slice(1),
            email: email.toLowerCase(),
            password,
            confirm_password,
            phone_number,
        });
        const user_id = new Types.ObjectId(String(user._id));
        // SAVE OTP
        const otp = await UtilsFunc.generateOtp({ user_id });
        await sendWelcomeEmail({
            email: user.email,
            name: user.first_name,
            otp: otp?.otp,
            subject: 'Welcome to GadgetBase',
        });

        return ResponseHandler.sendSuccessResponse({
            message: `A verification mail has been sent to ${user.email}`,
            code: 201,
            res,
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
