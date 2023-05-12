import { Types } from 'mongoose';
import { Product, ProductCategory } from '../models';
import { IProductCategory, IProductCategoryDocument } from '../interfaces/product/product-category.interface';
import { IProduct, IProductDocument } from '../interfaces/product/product.interface';

class ProductService {
   /****
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * PRODUCT RELATED SERVICES
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    */

   // Find By Product Name
   public getByProductName = async ({ product_name, leanVersion = true }: { product_name: string; leanVersion?: boolean }): Promise<IProductDocument> => {
      return await Product.findOne({ product_name }).lean(leanVersion);
   };

   // Get Product By Id
   public async getProductById({ product_id }: { product_id: Types.ObjectId }): Promise<IProductDocument | null> {
      return await Product.findById(product_id);
   }

   // Update Product
   public async atomicUpdate(product_id: Types.ObjectId, record: any) {
      return Product.findOneAndUpdate({ _id: product_id }, { ...record }, { new: true });
   }

   // Find By Product Category Name
   public getByCategoryName = async ({ category_name, leanVersion = true }: { category_name: string; leanVersion?: boolean }): Promise<IProductCategoryDocument> => {
      return await ProductCategory.findOne({ category_name }).lean(leanVersion);
   };

   // Delete Product
   public async deleteProduct(product_id: Types.ObjectId): Promise<IProductDocument | null | any> {
      return await Product.findByIdAndDelete({ _id: product_id });
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

   /****
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * PRODUCT CATEGORY RELATED SERVICES
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    */

   // Get Product Category By Id
   public async getProductByCategoryId({ category_id }: { category_id: Types.ObjectId }): Promise<IProductCategoryDocument | null | any> {
      return await Product.find({ category_id: category_id }).sort({ createdAt: -1 });
   }

   // Get All Product Categories
   public async getProductCategories(): Promise<IProductCategoryDocument[] | null> {
      return await ProductCategory.find();
   }

   // Update Product category
   public async atomicCategoryUpdate(category_id: Types.ObjectId, record: any) {
      return ProductCategory.findOneAndUpdate({ _id: category_id }, { ...record }, { new: true });
   }
   // Get Product Category By Id
   public async getProductCategoryById({ category_id }: { category_id: Types.ObjectId }): Promise<IProductCategoryDocument | null | any> {
      return await ProductCategory.findById(category_id);
   }
   // Delete Product Category
   public async deleteCategory(category_id: Types.ObjectId): Promise<IProductCategoryDocument | null | any> {
      return await ProductCategory.findByIdAndDelete({ _id: category_id });
   }

   // Create Product Category
   public async createProductCategory({ category_description, category_image, category_name }: IProductCategory): Promise<IProductCategoryDocument | null | any> {
      const data = {
         category_description,
         category_image,
         category_name,
      };

      return await ProductCategory.create(data);
   }
}

export default new ProductService();
