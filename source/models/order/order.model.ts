import mongoose, { Schema } from 'mongoose';
import { IStatus } from '../../interfaces/order/order.interface';

export const OrderSchema: Schema = new Schema(
   {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      phone_number: { type: String, required: true },
      additional_phone_number: { type: String },
      city: { type: String, required: true },
      address: { type: String, required: true },
      additional_info: { type: String },
      status: { type: String, enum: Object.values(IStatus), required: true },
      products: [
         {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            product_name: { type: String, required: true },
            quantity: { type: Number, required: true },
         },
      ],
      total_price: { type: Number, required: true },
   },
   {
      timestamps: true,
   },
);
