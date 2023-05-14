"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OtpSchema = new mongoose_1.Schema({
    otp: { type: Number },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    expires_in: { type: Date },
}, { timestamps: true });
