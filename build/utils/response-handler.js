"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    static sendSuccessResponse({ res, code = 200, message = 'Operation Successful', data = null, custom = false, }) {
        const response = custom && data ? { ...data } : { success: true, code: code, message, data };
        return res.status(code).json(response);
    }
    static sendErrorResponse({ res, code, error = 'Operation failed', custom = false, }) {
        const response = custom ? { code: code, message: error } : { success: false, code: code, message: error };
        return res.status(code).json(response);
    }
}
exports.default = ResponseHandler;
