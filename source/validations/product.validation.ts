import Joi from 'joi';
import ResponseHandler from '../utils/response-handler';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../server';

export const createProductCategory = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
   const schema = Joi.object()
      .keys({
         category_description: Joi.string().required(),
         category_image: Joi.string().required(),
         category_name: Joi.string().required(),
      })
      .unknown();
   const validation = schema.validate(req.body);
   if (validation.error) {
      const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
      return ResponseHandler.sendErrorResponse({ res, code: 400, error });
   }
   next();
};

export const createProduct = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
   const schema = Joi.object()
      .keys({
         category_id: Joi.string().required(),
         product_name: Joi.string().required(),
         product_price: Joi.number().required(),
         product_description: Joi.string().required(),
         product_image: Joi.string().required(),
         product_brand: Joi.string().required(),
         product_quantity: Joi.number().required(),
      })
      .unknown();
   const validation = schema.validate(req.body);
   if (validation.error) {
      const error = validation.error.message ? validation.error.message : validation.error.details[0].message;
      return ResponseHandler.sendErrorResponse({ res, code: 400, error });
   }
   next();
};
