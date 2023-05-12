import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import UtilsFunc from '../utils';
import { HTTP_CODES } from '../constants';
import productService from '../services/product.service';

/****
 *
 *
 * Admin Create Product Category
 */

export const createProductCategory = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_description, category_image, category_name } = req.body;

      const existingCategoryName = await productService.getByCategoryName({ category_name: category_name.toLowerCase() });

      if (existingCategoryName) {
         return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: `${category_name} category already exist` });
      }

      const category = await productService.createProductCategory({
         category_description,
         category_image,
         category_name: category_name.toLowerCase(),
      });

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.CREATED,
         message: `${category_name} Category added to the database`,
         data: category,
      });
   } catch (error) {
      ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

/****
 *
 *
 * Admin Create Product
 */

export const createProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_id, product_name, product_price, product_description, product_image, product_category, product_quantity } = req.body;

      if (!category_id) {
         return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.BAD_REQUEST,
            error: 'Category ID is required',
         });
      }

      const existingCategoryName = await productService.getByProductName({ product_name: product_name.toLowerCase() });

      if (existingCategoryName) {
         return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: `${product_name} already exist in the database` });
      }

      const product = await productService.createProduct({
         category_id,
         product_name: product_name.toLowerCase(),
         product_price,
         product_description,
         product_image,
         product_category,
         product_quantity,
      });

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.CREATED,
         message: `${product_name} added to the database`,
         data: product,
      });
   } catch (error) {
      ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};
