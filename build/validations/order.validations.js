"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeOrderStatus = void 0;
const joi_1 = __importDefault(require("joi"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const order_interface_1 = require("../interfaces/order/order.interface");
const changeOrderStatus = async (req, res, next) => {
    const schema = joi_1.default.object()
        .keys({
        status: joi_1.default.string().valid(order_interface_1.IStatus.delivered, order_interface_1.IStatus.processing).required(),
    })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
exports.changeOrderStatus = changeOrderStatus;
