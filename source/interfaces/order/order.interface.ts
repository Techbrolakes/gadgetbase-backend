import { Document, Types } from 'mongoose';

export enum IStatus {
   pending = 'pending',
   processing = 'processing',
   shipped = 'shipped',
   delivered = 'delivered',
}

export interface IOrder {
   user_id: Types.ObjectId;
   first_name: string;
   last_name: string;
   phone_number: string;
   additional_phone_number?: string;
   city: string;
   address: string;
   additional_info?: string;
   status?: IStatus;
   products: {
      product_id: Types.ObjectId;
      product_name: string;
      quantity: number;
   }[];
   total_price: number;
   session?: any;
}

export interface IOrderDocument extends IOrder, Document {}
