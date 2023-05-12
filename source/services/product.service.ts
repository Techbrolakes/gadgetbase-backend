import { Types } from 'mongoose';
import { Product, ProductCategory } from '../models';
import { IProductCategory, IProductCategoryDocument } from '../interfaces/product/product-category.interface';
import { IProduct, IProductDocument } from '../interfaces/product/product.interface';
import UtilsFunc from '../utils';

class ProductService {
   // Create product category
   public async createProductCategory({ category_description, category_image, category_name }: IProductCategory): Promise<IProductCategoryDocument | null | any> {
      const data = {
         category_description,
         category_image,
         category_name,
      };

      return await ProductCategory.create(data);
   }

   // Create product
   public async createProduct({
      category_id,
      product_category,
      product_description,
      product_image,
      product_name,
      product_price,
      product_quantity,
   }: IProduct): Promise<IProductDocument | null | any> {
      const data = {
         category_id,
         product_category,
         product_description,
         product_image,
         product_name,
         product_price,
         product_quantity,
      };

      return await Product.create(data);
   }

   // Get product category by id
   public async getCategoryById({ _id }: { _id: Types.ObjectId }): Promise<IProductCategoryDocument | null | any> {
      return await ProductCategory.findById(_id);
   }

   // Get product by id
   public async getProductById({ product_id }: { product_id: Types.ObjectId }): Promise<IProductDocument | null> {
      return await Product.findById(product_id);
   }

   // Find by product category name
   public getByCategoryName = async ({ category_name, leanVersion = true }: { category_name: string; leanVersion?: boolean }): Promise<IProductCategoryDocument> => {
      return await ProductCategory.findOne({ category_name }).lean(leanVersion);
   };
   // Find by product  name
   public getByProductName = async ({ product_name, leanVersion = true }: { product_name: string; leanVersion?: boolean }): Promise<IProductDocument> => {
      return await Product.findOne({ product_name }).lean(leanVersion);
   };
}

export default new ProductService();
