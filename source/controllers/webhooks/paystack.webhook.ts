import mongoose from 'mongoose';
import { Response } from 'express';
import crypto from 'crypto';
import { ExpressRequest } from '../../server';
import ResponseHandler from '../../utils/response-handler';
import { HTTP_CODES } from '../../constants';
import dotenv from 'dotenv';
import userService from '../../services/user.service';
import { paystackAPI } from '../../integrations/paystack';
import { createNewOrder } from '../order.controller';

dotenv.config();

export const paystackWebhook = async (req: ExpressRequest, res: Response) => {
   const session = await mongoose.startSession();

   try {
      await session.startTransaction();
      const { event } = req.body;
      if (event === 'charge.success') {
         const hash = crypto.createHmac('sha512', String(process.env.PAYSTACK_SECRET_KEY)).update(JSON.stringify(req.body)).digest('hex');

         const { id, reference, metadata } = req.body.data;
         if (hash !== req.headers['x-paystack-signature']) {
            return ResponseHandler.sendErrorResponse({
               res,
               code: HTTP_CODES.UNAUTHORIZED,
               error: 'Not valid webhook signature',
            });
         }

         // check if user exists
         const getUser = await userService.getById({ _id: metadata.user_id });

         // When user does not exist
         if (!getUser) {
            return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
         }

         const e = await paystackAPI.verifyTransaction(reference);

         const data = e.data;

         if (e.status) {
            try {
               const payload = {
                  first_name: data.metadata.first_name,
                  last_name: data.metadata.last_name,
                  phone_number: data.metadata.phone_number,
                  user_id: data.metadata.user_id,
                  additional_phone_number: data.metadata.additional_phone_number,
                  additional_info: data.metadata.additional_info,
                  city: data.metadata.city,
                  address: data.metadata.address,
                  total_price: data.metadata.total_price,
                  products: data.metadata.products,
               };

               const result = await createNewOrder(payload);

               if (!result.success) {
                  await session.abortTransaction();

                  return ResponseHandler.sendErrorResponse({
                     res,
                     code: HTTP_CODES.BAD_REQUEST,
                     error: 'Transactions aborted',
                  });
               }

               await session.commitTransaction();
               await session.endSession();

               return ResponseHandler.sendSuccessResponse({
                  res,
                  code: HTTP_CODES.OK,
                  message: 'Successful',
               });
            } catch (error) {
               return ResponseHandler.sendErrorResponse({
                  res,
                  code: HTTP_CODES.INTERNAL_SERVER_ERROR,
                  error: `${error}`,
               });
            } finally {
               await session.endSession();
            }
         }
      }
   } catch (error) {
      return ResponseHandler.sendErrorResponse({
         res,
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
      });
   }
};
