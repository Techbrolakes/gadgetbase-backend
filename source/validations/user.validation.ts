import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../server';

export const resetPassword = async (
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            token: Joi.string().required(),
            new_password: Joi.string().min(6).max(20).required(),
            confirm_password: Joi.string().min(6).max(20).required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};

export const verifyOTP = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            email: Joi.string().email().required(),
            otp: Joi.string().length(4).required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};

export const recoverPassword = async (
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            email: Joi.string().email().required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};

export const loginUser = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(20).required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};

export const resendVerification = async (
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            email: Joi.string().email().required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};

export const VerifyEmail = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            email: Joi.string().email().required(),
            otp: Joi.string().length(4).required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};

export const registerUser = async (
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const schema = Joi.object()
        .keys({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(20).required(),
            confirm_password: Joi.string().required(),
            phone_number: Joi.string().required(),
        })
        .unknown();
    const validation = schema.validate(req.body);
    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }
    next();
};
