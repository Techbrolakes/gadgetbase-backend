"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.VerifyEmail = exports.resendVerification = exports.loginUser = exports.recoverPassword = exports.verifyOTP = exports.resetPassword = void 0;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const resetPassword = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        token: joi_1.default.string().required(),
        new_password: joi_1.default.string().min(6).max(20).required(),
        confirm_password: joi_1.default.string().min(6).max(20).required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.resetPassword = resetPassword;
const verifyOTP = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        email: joi_1.default.string().email().required(),
        otp: joi_1.default.string().length(4).required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.verifyOTP = verifyOTP;
const recoverPassword = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        email: joi_1.default.string().email().required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.recoverPassword = recoverPassword;
const loginUser = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(20).required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.loginUser = loginUser;
const resendVerification = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        email: joi_1.default.string().email().required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.resendVerification = resendVerification;
const VerifyEmail = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        email: joi_1.default.string().email().required(),
        otp: joi_1.default.string().length(4).required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.VerifyEmail = VerifyEmail;
const registerUser = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(20).required(),
        confirm_password: joi_1.default.string().required(),
        phone_number: joi_1.default.string().required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.registerUser = registerUser;
