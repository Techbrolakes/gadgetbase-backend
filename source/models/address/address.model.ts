import mongoose, { Schema } from 'mongoose';

export const AddressSchema: Schema = new Schema(
   {
      user_id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      phone_number: { type: String, required: true },
      additional_phone_number: { type: String },
      city: { type: String, required: true },
      address: { type: String, required: true },
      additional_info: { type: String },
      primary: { type: Boolean, default: true },
   },
   { timestamps: true },
);
