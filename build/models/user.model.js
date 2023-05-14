"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, index: true, unique: true, lowercase: true },
    password: { type: String },
    phone_number: { type: String },
    admin: { type: Boolean, default: false },
}, { timestamps: true });
