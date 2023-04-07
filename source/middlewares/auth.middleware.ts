import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ResponseHandler from '../utils/response-handler';
import { ExpressRequest } from '../server';

const auth = (req: ExpressRequest, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token') || req.header('Authorization');
    if (!token) {
        return ResponseHandler.sendErrorResponse({ res, code: 401, error: 'Access denied. No token provided.' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'jwt', (error: any, decoded: any) => {
            if (error) {
                return ResponseHandler.sendErrorResponse({ res, code: 400, error: 'Invalid token Provided.' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } catch (error) {
        return ResponseHandler.sendErrorResponse({ res, code: 400, error: 'Invalid token Provided.' });
    }
};

export default auth;
