import { Schema } from 'mongoose';

export const ProductCategorySchema: Schema = new Schema(
   {
      category_name: { type: String, required: true },
      category_image: { type: String },
      category_description: { type: String },
   },
   {
      timestamps: true,
   },
);
