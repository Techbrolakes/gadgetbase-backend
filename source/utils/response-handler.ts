import { Response } from 'express';
import { IResponse, IResponseError } from '../interfaces/response.interface';

class ResponseHandler {
    // Success Response Handler
    public static sendSuccessResponse({
        res,
        code = 200,
        message = 'Operation Successful',
        data = null,
        custom = false,
    }: IResponse): Response<any> {
        const response = custom && data ? { ...data } : { success: true, code: code, message, data };
        return res.status(code).json(response);
    }

    // Error Response Handler
    public static sendErrorResponse({
        res,
        code,
        error = 'Operation failed',
        custom = false,
    }: IResponseError): Response<any> {
        const response = custom ? { code: code, message: error } : { success: false, code: code, message: error };
        return res.status(code).json(response);
    }
}

export default ResponseHandler;
