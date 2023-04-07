"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("../interfaces/user.interface");
exports.UserSchema = new mongoose_1.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, index: true, unique: true, lowercase: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: Object.values(user_interface_1.IGenderType) },
    verified_email: { type: Boolean, default: false },
    verified_email_at: Date,
    is_disabled: { type: Boolean, default: false },
}, { timestamps: true });
