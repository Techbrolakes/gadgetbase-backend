import { model } from 'mongoose';

// USER
import { UserSchema } from './user.model';
import { IUserDocument } from '../interfaces/user.interface';

// OTP
import { OtpSchema } from './otp.model';
import { IOtpDocument } from '../interfaces/otp.interface';

// PRODUCT
import { ProductSchema } from './product/product.model';
import { IProductDocument } from '../interfaces/product/product.interface';

// PRODUCT CATEGORY
import { ProductCategorySchema } from './product/product-category.model';
import { IProductCategoryDocument } from '../interfaces/product/product-category.interface';

export const Otp = model<IOtpDocument>('Otps', OtpSchema);
export const User = model<IUserDocument>('Users', UserSchema);
export const Product = model<IProductDocument>('Products', ProductSchema);
export const ProductCategory = model<IProductCategoryDocument>('ProductCategories', ProductCategorySchema);
