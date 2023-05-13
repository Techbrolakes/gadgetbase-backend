import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema(
   {
      first_name: { type: String },
      last_name: { type: String },
      email: { type: String, required: true, index: true, unique: true, lowercase: true },
      password: { type: String },
      phone_number: { type: String },
      admin: { type: Boolean, default: false },
   },
   { timestamps: true },
);
