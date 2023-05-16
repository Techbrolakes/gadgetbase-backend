import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../server';
import { IStatus } from '../interfaces/order/order.interface';

export const changeOrderStatus = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
   const schema = Joi.object()
      .keys({
         status: Joi.string().valid(IStatus.delivered, IStatus.processing).required(),
      })
      .unknown();

   const validation = schema.validate(req.body);
   if (validation.error) {
      const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
      return ResponseHandler.sendErrorResponse({ res, code: 400, error });
   }
   next();
};
