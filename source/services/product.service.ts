import { Types } from 'mongoose';
import { Product, ProductCategory } from '../models';
import { IProductCategory, IProductCategoryDocument } from '../interfaces/product/product-category.interface';
import { IProduct, IProductDocument } from '../interfaces/product/product.interface';
import UtilsFunc from '../utils';

class ProductService {
   // Delete product
   public async deleteProduct(product_id: Types.ObjectId): Promise<IProductDocument | null | any> {
      return await Product.findByIdAndDelete({ _id: product_id });
   }

   // Update product
   public async atomicUpdate(product_id: Types.ObjectId, record: any) {
      return Product.findOneAndUpdate({ _id: product_id }, { ...record }, { new: true });
   }
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
   public async getCategoryById({ category_id }: { category_id: Types.ObjectId }): Promise<IProductCategoryDocument | null | any> {
      return await Product.find({ category_id: category_id }).sort({ createdAt: -1 });
   }

   // Get product by id
   public async getProductById({ product_id }: { product_id: Types.ObjectId }): Promise<IProductDocument | null> {
      return await Product.findById(product_id);
   }

   // Get all product categories
   public async getProductCategories(): Promise<IProductCategoryDocument[] | null> {
      return await ProductCategory.find();
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
