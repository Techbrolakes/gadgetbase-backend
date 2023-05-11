import mongoose, { Schema } from 'mongoose';

export const ProductSchema: Schema = new Schema(
   {
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      product_name: { type: String, required: true },
      product_price: { type: Number, required: true },
      product_description: { type: String, required: true },
      product_image: { type: String, required: true },
      product_category: { type: String, required: true },
      product_quantity: { type: Number, required: true },
   },
   {
      timestamps: true,
   },
);
