import { Types } from 'mongoose';
import { Product, ProductCategory } from '../models';
import { IProductCategory, IProductCategoryDocument } from '../interfaces/product/product-category.interface';
import { IProduct, IProductDocument } from '../interfaces/product/product.interface';
import { ExpressRequest } from '../server';

class ProductService {
   /****
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * PRODUCT RELATED SERVICES
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    */

   // Get All Products
   public async getProducts(req: ExpressRequest): Promise<IProductDocument[] | null | any> {
      const { query } = req;
      const search = String(query.search) || '';
      const perpage = Number(query.perpage) || 10;
      const page = Number(query.page) || 1;
      const brand = String(query.brand) || '';
      const minPrice = Number(query.minPrice) || 0;
      const maxPrice = Number(query.maxPrice) || Infinity;
      let filterQuery;

      if (search !== 'undefined' && Object.keys(search).length > 0) {
         filterQuery = {
            $or: [{ product_name: new RegExp(search, 'i') }],
         };
      }

      if (brand !== 'undefined' && brand.length > 0) {
         filterQuery = { ...filterQuery, product_brand: brand };
      }

      const filter = { ...filterQuery, product_price: { $gte: minPrice, $lte: maxPrice } };

      const [products, total] = await Promise.all([
         Product.find(filter)
            .lean(true)
            .sort({ createdAt: -1 })
            .limit(perpage)
            .skip(page * perpage - perpage),
         Product.aggregate([{ $match: filter }, { $count: 'count' }]),
      ]);

      const pagination = {
         hasPrevious: page > 1,
         prevPage: page - 1,
         hasNext: page < Math.ceil(total[0]?.count / perpage),
         next: page + 1,
         currentPage: Number(page),
         total: total[0]?.count || 0,
         pageSize: perpage,
         lastPage: Math.ceil(total[0]?.count / perpage),
      };

      return { data: products, pagination };
   }

   // Get distinct values for a given field
   public async getDistinctValues(fieldName: string): Promise<any> {
      return await Product.distinct(fieldName);
   }
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
      product_brand,
      product_description,
      product_image,
      product_name,
      product_price,
      product_quantity,
   }: IProduct): Promise<IProductDocument | null | any> {
      const data = {
         category_id,
         product_brand,
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

   // Get Product Category By Id and filter & Paginate
   public async getProductByCategoryId(req: ExpressRequest): Promise<IProductDocument[] | null | any> {
      const { query, params } = req;
      const categoryId = params.category_id;
      const search = String(query.search) || '';
      const brand = String(query.brand) || '';
      const minPrice = Number(query.minPrice) || 0;
      const maxPrice = Number(query.maxPrice) || Infinity;
      const perpage = Number(query.perpage) || 10;
      const page = Number(query.page) || 1;
      let filterQuery: any = { category_id: new Types.ObjectId(categoryId) };

      if (search !== 'undefined' && Object.keys(search).length > 0) {
         filterQuery.$or = [{ product_name: new RegExp(search, 'i') }];
      }

      if (brand) {
         filterQuery.product_brand = new RegExp(brand, 'i');
      }

      if (minPrice || maxPrice) {
         filterQuery.product_price = {};
         if (minPrice) {
            filterQuery.product_price.$gte = minPrice;
         }
         if (maxPrice) {
            filterQuery.product_price.$lte = maxPrice;
         }
      }

      const filter = { ...filterQuery };

      const [products, total] = await Promise.all([
         Product.find(filter)
            .lean(true)
            .sort({ createdAt: -1 })
            .limit(perpage)
            .skip(page * perpage - perpage),
         Product.aggregate([{ $match: filter }, { $count: 'count' }]),
      ]);

      const pagination = {
         hasPrevious: page > 1,
         prevPage: page - 1,
         hasNext: page < Math.ceil(total[0]?.count / perpage),
         next: page + 1,
         currentPage: Number(page),
         total: total[0]?.count || 0,
         pageSize: perpage,
         lastPage: Math.ceil(total[0]?.count / perpage),
      };

      return { data: products, pagination };
   }

   // Get Product Category By Id Only
   public async getProductByCategoryIdOnly({ category_id }: { category_id: Types.ObjectId }): Promise<IProductCategoryDocument | null | any> {
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
