"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class OtpService {
    constructor() {
        this.createOtp = async ({ expires_in, otp, user_id }) => {
            const otpData = { expires_in, otp, user_id };
            return await models_1.Otp.create(otpData);
        };
        this.getOtpByUser = async ({ user_id }) => {
            return models_1.Otp.findOne({ user_id });
        };
        this.updateOtp = async ({ user_id, otp, expires_in }) => {
            return await models_1.Otp.findOneAndUpdate({ user_id: user_id }, { $set: { otp: otp, expires_in: expires_in } }, { new: true });
        };
        this.verifyOtp = async ({ otp, user_id }) => {
            try {
                const getOtp = await this.getOtpByUser({ user_id });
                if (getOtp?.otp == otp && Number(getOtp?.expires_in) > Date.now()) {
                    return { status: true };
                }
                if (getOtp?.otp !== otp || getOtp?.expires_in < new Date()) {
                    return { status: false, message: 'OTP is invalid or expired' };
                }
                return { status: false };
            }
            catch (err) {
                return { status: false, message: err.message };
            }
        };
    }
}
exports.default = new OtpService();
