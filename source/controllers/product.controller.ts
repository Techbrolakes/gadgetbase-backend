import { Response } from 'express';
import { ExpressRequest } from '../server';
import ResponseHandler from '../utils/response-handler';
import { HTTP_CODES } from '../constants';
import productService from '../services/product.service';
import { Types } from 'mongoose';

/****
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * PRODUCT RELATED CONTROLLERS
 * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// Create Product Controller For Admin
export const createProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_id, product_name, product_price, product_description, product_image, product_brand, product_quantity } = req.body;

      // Check if category_id is provided
      if (!category_id) {
         return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.BAD_REQUEST,
            error: 'Category ID is required',
         });
      }

      // Check if category exist
      const existingCategory = await productService.getProductCategoryById({ category_id: new Types.ObjectId(category_id) });

      // If category does not exist
      if (!existingCategory) {
         return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.NOT_FOUND,
            error: 'Category does not exist',
         });
      }

      // Check if product name is provided
      const existingProductName = await productService.getByProductName({ product_name: product_name.toLowerCase() });

      // If product name exist
      if (existingProductName) {
         return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: `${product_name} already exist in the database` });
      }

      // Create product
      const product = await productService.createProduct({
         category_id,
         product_name: product_name.toLowerCase(),
         product_price,
         product_description,
         product_image,
         product_brand,
         product_quantity,
      });

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.CREATED,
         message: `${product_name} added to the database`,
         data: product,
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

// Get Unique Product Values
export const getAllProductBrands = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const productBrands = await productService.getDistinctValues('product_brand');

      const existingProductBrands = productBrands.filter((productBrand: any) => productBrand !== null);

      if (existingProductBrands.length === 0) {
         return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.NOT_FOUND, error: 'No product brands found' });
      }

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Product brands retrieved successfully',
         data: productBrands,
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

// Get Unique Product Values By Category Id
export const getProductBrandsByCategoryId = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const categoryId = req.params.category_id;

      const existingCategory = await productService.getProductCategoryById({ category_id: new Types.ObjectId(categoryId) });

      if (!existingCategory) {
         return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: 'Category Id Not Valid' });
      }

      const productBrands = await productService.getDistinctValuesByCategoryId('product_brand', new Types.ObjectId(categoryId));

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Product brands based on categories retrieved successfully',
         data: productBrands,
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

// Get All Products
export const getAllProducts = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const products = await productService.getProducts(req);

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Products retrieved successfully',
         data: products,
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
// Get Single Product
export const getProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      // Get product id
      const product_id = req.params.product_id;

      // Check if product id exists
      if (!product_id) {
         return ResponseHandler.sendErrorResponse({
            res,
            code: HTTP_CODES.BAD_REQUEST,
            error: 'Product ID is required',
         });
      }

      // Check if product exist
      const product = await productService.getProductById({ product_id: new Types.ObjectId(product_id) });

      if (product) {
         // Return response
         return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: 'Product retrieved successfully',
            data: product,
         });
      }
   } catch (error) {
      // Return error response
      ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

// Get Product By Category
export const getProductByCategory = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      // Get category id
      const category_id = req.params.category_id;

      // Check if category id is provided
      const category = await productService.getProductByCategoryId(req);

      // If category does not exist

      if (category) {
         // Return response

         return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: 'Product category retrieved successfully',
            data: category,
         });
      }
   } catch (error) {
      // Return error response

      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

// Update Product
export const updateProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_id, product_name, product_price, product_description, product_image, product_brand, product_quantity } = req.body;

      // Check if product id is provided
      const product_id = new Types.ObjectId(req.params.product_id);

      // Check if product exist
      const product = await productService.getProductById({ product_id });

      // If product does not exist
      if (!product) {
         return ResponseHandler.sendErrorResponse({
            code: HTTP_CODES.NOT_FOUND,
            error: 'Product does not exist',
            res,
         });
      }

      // Update product
      const updatedProduct = await productService.atomicUpdate(product_id, {
         $set: {
            product_name,
            product_price,
            product_description,
            product_image,
            product_brand,
            product_quantity,
            category_id: new Types.ObjectId(category_id),
         },
      });

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Product updated successfully',
         data: updatedProduct,
      });
   } catch (error) {
      // Return error response
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

// Delete Product
export const deleteProduct = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      // Check if product id is provided
      const product_id = new Types.ObjectId(req.params.product_id);

      // Check if product exist
      const product = await productService.getProductById({ product_id });

      // If product does not exist
      if (!product) {
         return ResponseHandler.sendErrorResponse({
            code: HTTP_CODES.NOT_FOUND,
            error: 'Product does not exist',
            res,
         });
      }

      // Delete product
      await productService.deleteProduct(product_id);

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Product deleted successfully',
      });
   } catch (error) {
      // Return error response
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

/****
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * PRODUCT CATEGORY RELATED CONTROLLERS
 * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// Create Product Category
export const createProductCategory = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_description, category_image, category_name } = req.body;

      // Gets the category name
      const existingCategoryName = await productService.getByCategoryName({ category_name: category_name.toLowerCase() });

      // If category name exists
      if (existingCategoryName) {
         return ResponseHandler.sendErrorResponse({ res, code: HTTP_CODES.BAD_REQUEST, error: `${category_name} category already exist` });
      }

      // Create category
      const category = await productService.createProductCategory({
         category_description,
         category_image,
         category_name: category_name.toLowerCase(),
      });

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.CREATED,
         message: `${category_name} Category added to the database`,
         data: category,
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

// Get Product Categories
export const getProductCategories = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      // Get product categories
      const categories = await productService.getProductCategories();

      // Return response
      if (categories) {
         return ResponseHandler.sendSuccessResponse({
            res,
            code: HTTP_CODES.OK,
            message: 'Product categories retrieved successfully',
            data: categories,
         });
      }
   } catch (error) {
      // Return error response
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

// Update Product Category
export const updateProductCategory = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const { category_description, category_image, category_name } = req.body;

      // Check if category id is provided
      const category_id = new Types.ObjectId(req.params.category_id);

      // Check if category exist
      const category = await productService.getProductCategoryById({ category_id });

      // If category does not exist
      if (!category) {
         return ResponseHandler.sendErrorResponse({
            code: HTTP_CODES.NOT_FOUND,
            error: 'Category does not exist',
            res,
         });
      }

      // Update category
      const updatedCategory = await productService.atomicCategoryUpdate(category_id, {
         $set: {
            category_description,
            category_image,
            category_name,
         },
      });

      // Return response
      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Category updated successfully',
         data: updatedCategory,
      });
   } catch (error) {
      // Return error response
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};

// Delete Product Category
export const deleteProductCategory = async (req: ExpressRequest, res: Response): Promise<Response | void> => {
   try {
      const category_id = new Types.ObjectId(req.params.category_id);

      // Check if the category exists
      const existingCategory = await productService.getProductCategoryById({ category_id });

      // If the category does not exist
      if (!existingCategory) {
         return ResponseHandler.sendErrorResponse({
            code: HTTP_CODES.NOT_FOUND,
            error: 'Category does not exist',
            res,
         });
      }

      // Get all products with the category id
      const productWithCategoryId = await productService.getProductByCategoryIdOnly({ category_id });

      // Delete the category
      const deleteCategory = await productService.deleteCategory(category_id);

      // Delete all the products with the category id
      if (deleteCategory) {
         if (productWithCategoryId.length > 0) {
            for (let i = 0; i < productWithCategoryId.length; i++) {
               await productService.deleteProduct(productWithCategoryId[i]._id);
            }
         }
      }

      return ResponseHandler.sendSuccessResponse({
         res,
         code: HTTP_CODES.OK,
         message: 'Category successfully deleted with all the products in it ',
      });
   } catch (error) {
      return ResponseHandler.sendErrorResponse({
         code: HTTP_CODES.INTERNAL_SERVER_ERROR,
         error: `${error}`,
         res,
      });
   }
};
