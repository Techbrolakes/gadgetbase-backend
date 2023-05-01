import { Document } from 'mongoose';

export interface IProduct {
   product_name?: string;
   product_price?: number;
   product_description?: string;
   product_image?: string;
   product_category?: string;
   product_quantity?: number;
   product_rating?: number;
}

export interface IProductDocument extends IProduct, Document {}
