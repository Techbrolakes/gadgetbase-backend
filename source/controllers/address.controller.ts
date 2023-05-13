import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import UtilsFunc from '../utils';
import userService from '../services/user.service';
import { HTTP_CODES } from '../constants';
import addressService from '../services/address.service';
import { Types } from 'mongoose';

/****
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * ADDRESS RELATED CONTROLLERS
 * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// Get User Addresses
export const getUserAddresses = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      // check if user exists
      const getUser = await userService.getById({ _id: user._id });

      // When user does not exist
      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      const address = await addressService.getAll({ user_id: user._id });

      // Return success response
      ResponseHandler.sendSuccessResponse({
         res,
         message: 'User addresses retrieved successfully',
         data: address,
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

// Create Profile Address
export const createAddress = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      // request body
      const { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary } = req.body;

      // check if user exists
      const getUser = await userService.getById({ _id: user._id });

      // When user does not exist
      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      // if default is true, set all other addresses to false
      if (primary) {
         await addressService.updateAll({ user_id: user._id }, { $set: { primary: false } });
      }

      const newAddress = await addressService.createAddress({
         user_id: user._id,
         first_name,
         last_name,
         phone_number,
         additional_phone_number,
         additional_info,
         city,
         address,
         primary,
      });

      // Return success response
      ResponseHandler.sendSuccessResponse({
         res,
         message: 'Address created successfully',
         data: newAddress,
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

// Update Profile Address
export const updateAddress = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      // request body
      const { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary } = req.body;

      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      // check if user exists
      const getUser = await userService.getById({ _id: user._id });

      // When user does not exist
      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      // Check if product id is provided
      const address_id = new Types.ObjectId(req.params.address_id);

      // check if address exists
      const getAddress = await addressService.getAddressById({ address_id });

      // When address does not exist
      if (!getAddress) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Address does not exist' });
      }

      // if default is true, set all other addresses to false
      if (primary) {
         await addressService.updateAll({ user_id: user._id }, { $set: { primary: false } });
      }

      // Update address
      const updatedAddress = await addressService.atomicUpdate(address_id, {
         $set: {
            first_name,
            last_name,
            phone_number,
            additional_phone_number,
            additional_info,
            city,
            address,
            primary,
         },
      });

      // Return success response
      ResponseHandler.sendSuccessResponse({
         res,
         message: 'Address updated successfully',
         data: updatedAddress,
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

// Delete Profile Address
export const deleteAddress = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      // check if user exists
      const getUser = await userService.getById({ _id: user._id });

      // When user does not exist
      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      // Check if product id is provided
      const address_id = new Types.ObjectId(req.params.address_id);

      // check if address exists
      const getAddress = await addressService.getAddressById({ address_id });

      // When address does not exist
      if (!getAddress) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Address does not exist' });
      }

      // Delete address
      const deletedAddress = await addressService.deleteById(address_id);

      // Return success response
      ResponseHandler.sendSuccessResponse({
         res,
         message: 'Address deleted successfully',
         data: deletedAddress,
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
