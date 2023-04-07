import { Types } from 'mongoose';
import otpService from '../services/otp.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class UtilsFunc {
    // Generate OTP
    public static generateOtp = async ({ user_id }: { user_id: Types.ObjectId }) => {
        const otp = Math.floor(Math.random() * 8999 + 1000);
        const ttl = 15 * 60 * 1000;
        const expires_in = new Date(Date.now() + ttl);

        const check_otp = await otpService.getOtpByUser({ user_id });
        if (!check_otp) {
            return otpService.createOtp({ otp, expires_in, user_id });
        } else {
            return otpService.updateOtp({ otp, expires_in, user_id });
        }
    };

    /** Generate and sign a user Token */
    public static generateToken = (data: any) => {
        return jwt.sign(data, process.env.JWT_SECRET || 'jwt', {
            expiresIn: '1h',
        });
    };

    public static throwIfUndefined = <T>(x: T | undefined, name: string = 'Value'): T => {
        if (x === undefined) {
            throw new Error(`${name} must not be undefined`);
        }
        return x;
    };

    /** Generate and verify a user Token */
    public static verifyToken = async (token: string, secret = process.env.JWT_SECRET || 'jwt') => {
        try {
            const decoded = await jwt.verify(token, secret);
            return decoded;
        } catch (err: any) {
            if (err instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            } else if (err instanceof jwt.TokenExpiredError) {
                throw new Error('Token expired');
            } else {
                throw new Error('Failed to verify token');
            }
        }
    };
}

export default UtilsFunc;
