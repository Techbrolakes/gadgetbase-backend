"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("./user.model");
const otp_model_1 = require("./otp.model");
exports.Otp = (0, mongoose_1.model)('Otps', otp_model_1.OtpSchema);
exports.User = (0, mongoose_1.model)('Users', user_model_1.UserSchema);
