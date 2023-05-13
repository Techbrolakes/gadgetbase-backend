import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../server';

export const createAddress = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
   const schema = Joi.object()
      .keys({
         first_name: Joi.string().required(),
         last_name: Joi.string().required(),
         address: Joi.string().required(),
         phone_number: Joi.string().required(),
         additional_phone_number: Joi.string().allow(''),
         city: Joi.string().required(),
         additional_info: Joi.string().allow(''),
         primary: Joi.boolean().required(),
      })
      .unknown();
   const validation = schema.validate(req.body);
   if (validation.error) {
      const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
      return ResponseHandler.sendErrorResponse({ res, code: 400, error });
   }
   next();
};
