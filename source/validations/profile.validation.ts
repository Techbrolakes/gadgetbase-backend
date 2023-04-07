import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../server';

export async function validateResetPassword(
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
): Promise<Response | void> {
    const schema = Joi.object().keys({
        current_password: Joi.string().required(),
        new_password: Joi.string().required(),
        confirm_password: Joi.string().required(),
    });

    const validation = schema.validate(req.body);

    if (validation.error) {
        const error = validation.error.message ? validation.error.message : validation.error.details[0].message;

        return ResponseHandler.sendErrorResponse({ res, code: 400, error });
    }

    return next();
}
