import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import UtilsFunc from '../utils';
import userService from '../services/user.service';
import bcrypt from 'bcrypt';
import { HTTP_CODES } from '../constants';

/****
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * PROFILE RELATED CONTROLLERS
 * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// Get Profile Controller
export const getUserDetails = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user = UtilsFunc.throwIfUndefined(req.user, 'req.user');

      const getUser = await userService.getById({ _id: user._id });

      if (!getUser) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      const profile = await userService.getByQuery({ _id: user._id }, 'first_name last_name email address');

      return ResponseHandler.sendSuccessResponse({
         res,
         code: 200,
         message: 'User data successfully retrieved',
         data: profile,
      });
   } catch (error) {
      return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
   }
};

// Edit Profile Controller
export const editProfile = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user_id = UtilsFunc.throwIfUndefined(req.user, 'req.user')._id;

      Object.keys(req.body).forEach((e: any) => req.body[e] == '' && delete req.body[e]);

      const user = await userService.atomicUpdate(user_id, req.body);
      if (user) {
         return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: 'Information updated',
            data: user,
         });
      }
   } catch (error) {
      return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
   }
};

// Reset Password Controller
export const resetPassword = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const user_id = UtilsFunc.throwIfUndefined(req.user, 'req.user')._id;

      const { current_password, new_password, confirm_password } = req.body;

      const user = await userService.getById({ _id: user_id });
      if (!user) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
      }

      const result = bcrypt.compareSync(current_password, user?.password!);
      if (!result) {
         return ResponseHandler.sendErrorResponse({
            res,
            code: 404,
            error: 'Current password is incorrect.',
         });
      }

      if (new_password !== confirm_password) {
         return ResponseHandler.sendErrorResponse({ res, code: 404, error: 'Password does not match' });
      }

      const password = bcrypt.hashSync(new_password, 10);

      const saved = await userService.atomicUpdate(user_id, { $set: { password: password } });

      if (saved) {
         return ResponseHandler.sendSuccessResponse({
            res,
            code: 200,
            message: 'Information updated',
         });
      }
   } catch (error) {
      return ResponseHandler.sendErrorResponse({ res, code: 500, error: `${error}` });
   }
};
