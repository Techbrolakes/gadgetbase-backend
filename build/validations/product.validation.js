"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.createProductCategory = void 0;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const createProductCategory = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        category_description: joi_1.default.string().required(),
        category_image: joi_1.default.string().required(),
        category_name: joi_1.default.string().required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.createProductCategory = createProductCategory;
const createProduct = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        category_id: joi_1.default.string().required(),
        product_name: joi_1.default.string().required(),
        product_price: joi_1.default.number().required(),
        product_description: joi_1.default.string().required(),
        product_image: joi_1.default.string().required(),
        product_brand: joi_1.default.string().required(),
        product_quantity: joi_1.default.number().required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.createProduct = createProduct;
