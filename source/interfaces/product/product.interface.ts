import { Document } from 'mongoose';

export interface IProduct {
   category_id?: string;
   product_name?: string;
   product_price?: number;
   product_description?: string;
   product_image?: string;
   product_brand?: string;
   product_quantity?: number;
}

export interface IProductDocument extends IProduct, Document {}
