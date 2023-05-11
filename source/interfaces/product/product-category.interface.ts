import { Document } from 'mongoose';

export interface IProductCategory {
   category_name?: string;
   category_image?: string;
   category_description?: string;
}

export interface IProductCategoryDocument extends IProductCategory, Document {}
