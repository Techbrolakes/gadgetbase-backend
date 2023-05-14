"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddress = void 0;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const createAddress = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        address: joi_1.default.string().required(),
        phone_number: joi_1.default.string().required(),
        additional_phone_number: joi_1.default.string().allow(''),
        city: joi_1.default.string().required(),
        additional_info: joi_1.default.string().allow(''),
        primary: joi_1.default.boolean().required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.createAddress = createAddress;
