import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import { HTTP_CODES } from '../constants';
import { Types } from 'mongoose';
import UtilsFunc from '../utils';
import userService from '../services/user.service';
import { paystackAPI } from '../integrations/paystack';
import productService from '../services/product.service';
import orderService from '../services/order.service';
import { IStatus } from '../interfaces/order/order.interface';

/****
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * ORDER RELATED CONTROLLERS
 * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// Create New Order
export const createNewOrder = async (data: any): Promise<any> => {
   try {
      const { first_name, last_name, phone_number, user_id, additional_phone_number, additional_info, city, address, total_price, products } = data;

      const orderProducts = products.map((product: any) => ({
         product_id: new Types.ObjectId(product.product_id),
         product_name: product.product_name,
         quantity: product.quantity,
      }));

      const order = await orderService.createOrder({
         user_id: user_id,
         first_name: first_name,
         last_name: last_name,
         phone_number: phone_number,
         additional_phone_number: additional_phone_number,
         additional_info: additional_info,
         city: city,
         address: address,
         products: orderProducts,
         total_price: total_price,
         session: data.session,
      });

      await productService.updateProductQuantities(products);

      return {
         success: true,
         message: 'Order created successfully',
         data: order,
      };
   } catch (error) {
      console.log(error);
   }
};

// PAY ON DELIVERY
export const payOnDelivery = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      const { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, total_price, products } = req.body;

      const getUser = await userService.getById({ _id: user._id });

      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      const orderProducts = products.map((product: any) => ({
         product_id: new Types.ObjectId(product.product_id),
         product_name: product.product_name,
         quantity: product.quantity,
      }));

      const order = await orderService.createOrder({
         user_id: user._id,
         first_name,
         last_name,
         phone_number,
         additional_phone_number,
         additional_info,
         city,
         address,
         products: orderProducts,
         total_price,
      });

      await productService.updateProductQuantities(products);

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Order created successfully',
         data: order,
      });
   } catch (error) {
      ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

// Create Payment Service For New Order
export const createPaymentService = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      const { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, total_price, products } = req.body;

      // check if user exists
      const getUser = await userService.getById({ _id: user._id });

      // When user does not exist
      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      const reference = UtilsFunc.generateTXRef();
      const transaction_hash = UtilsFunc.generateTXHash();

      const payload = {
         email: user?.email!,
         amount: total_price * 100,
         callback_url: 'https://documenter.getpostman.com/view/11498186/2s93ecwqYn',
         metadata: {
            first_name,
            last_name,
            phone_number,
            additional_phone_number,
            additional_info,
            products,
            city,
            address,
            total_price,
            user_id: user._id,
            payment_reference: reference,
            transaction_hash,
         },
         customerName: `${user?.first_name} ${user?.last_name}`,
      };

      const [apiCall] = await Promise.all([await paystackAPI.initializeTransaction(payload)]);

      const data = {
         url: apiCall.data.authorization_url,
         access_code: apiCall.data.access_code,
         reference: apiCall.data.reference,
      };

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Paystack payment url generated successfully',
         data: data,
      });
   } catch (error) {
      // Return error response
      ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};
