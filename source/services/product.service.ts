import { Types } from 'mongoose';
import { Product, ProductCategory } from '../models';
import { IProductCategoryDocument } from '../interfaces/product/product-category.interface';
import { IProductDocument } from '../interfaces/product/product.interface';
import UtilsFunc from '../utils';

class ProductService {
   // Get all products categories
   public async getCategoryById({ _id }: { _id: Types.ObjectId }): Promise<IProductCategoryDocument | null | any> {
      return await ProductCategory.findById(_id);
   }
   // Get product by id
   public async getProductById({ product_id }: { product_id: Types.ObjectId }): Promise<IProductDocument | null> {
      return await Product.findById(product_id);
   }
}

export default new ProductService();
