import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import UtilsFunc from '../utils';
import { HTTP_CODES } from '../constants';
import productService from '../services/product.service';
import { Types } from 'mongoose';

/****
 *
 *
 *  Delete Product
 */

export const deleteProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const product_id = new Types.ObjectId(req.params.product_id);

      const product = await productService.getProductById({ product_id });

      if (!product) {
         return ResponseHandler.sendErrorResponse({
            code: HTTP_CODES.NOT_FOUND,
            error: 'Product does not exist',
            res,
         });
      }

      await productService.deleteProduct(product_id);

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Product deleted successfully',
      });
   } catch (error) {
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

/****
 *
 *
 *  Edit Product
 */

export const updateProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_id, product_name, product_price, product_description, product_image, product_category, product_quantity } = req.body;

      const product_id = new Types.ObjectId(req.params.product_id);

      const product = await productService.getProductById({ product_id });

      if (!product) {
         return ResponseHandler.sendErrorResponse({
            code: HTTP_CODES.NOT_FOUND,
            error: 'Product does not exist',
            res,
         });
      }

      const updatedProduct = await productService.atomicUpdate(product_id, {
         $set: {
            product_name,
            product_price,
            product_description,
            product_image,
            product_category,
            product_quantity,
            category_id: new Types.ObjectId(category_id),
         },
      });

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Product updated successfully',
         data: updatedProduct,
      });
   } catch (error) {
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

/****
 *
 *
 *  Get Product By Category
 */
export const getProductByCategory = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const category_id = req.params.category_id;
      const category = await productService.getCategoryById({ category_id: new Types.ObjectId(category_id) });

      console.log(category);

      if (category) {
         return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: 'Product category retrieved successfully',
            data: category,
         });
      }
   } catch (error) {
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

/****
 *
 *
 * Admin Get Product Category
 */

export const getProductCategories = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const categories = await productService.getProductCategories();
      if (categories) {
         return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: 'Product categories retrieved successfully',
            data: categories,
         });
      }
   } catch (error) {
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

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
