"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const auth = (req, res, next) => {
    const token = req.header('x-auth-token') || req.header('Authorization');
    if (!token) {
        return response_handler_1.default.sendErrorResponse({ res, code: 401, error: 'Access denied. No token provided.' });
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'jwt', (error, decoded) => {
            if (error) {
                return response_handler_1.default.sendErrorResponse({ res, code: 400, error: 'Invalid token Provided.' });
            }
            else {
                req.user = decoded;
                next();
            }
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 400, error: 'Invalid token Provided.' });
    }
};
exports.default = auth;
