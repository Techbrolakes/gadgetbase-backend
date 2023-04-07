import { model } from 'mongoose';

// USER
import { UserSchema } from './user.model';
import { IUserDocument } from '../interfaces/user.interface';

// OTP
import { OtpSchema } from './otp.model';
import { IOtpDocument } from '../interfaces/otp.interface';

export const Otp = model<IOtpDocument>('Otps', OtpSchema);
export const User = model<IUserDocument>('Users', UserSchema);
