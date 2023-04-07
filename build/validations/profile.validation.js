"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassword = void 0;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
async function validateResetPassword(req, res, next) {
    const schema = joi_1.default.object().keys({
        current_password: joi_1.default.string().required(),
        new_password: joi_1.default.string().required(),
        confirm_password: joi_1.default.string().required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    return next();
}
exports.validateResetPassword = validateResetPassword;
