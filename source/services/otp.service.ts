import { IOtpDocument } from '../interfaces/otp.interface';
import { Otp } from '../models';
import { Types } from 'mongoose';
import { IOtp } from '../interfaces/otp.interface';

class OtpService {
   public createOtp = async ({ expires_in, otp, user_id }: IOtp): Promise<IOtpDocument> => {
      const otpData = { expires_in, otp, user_id };
      return await Otp.create(otpData);
   };

   public getOtpByUser = async ({ user_id }: { user_id: Types.ObjectId }): Promise<IOtpDocument | null> => {
      return Otp.findOne({ user_id });
   };

   public updateOtp = async ({ user_id, otp, expires_in }: IOtp): Promise<IOtpDocument | null> => {
      return await Otp.findOneAndUpdate({ user_id: user_id }, { $set: { otp: otp, expires_in: expires_in } }, { new: true });
   };

   public verifyOtp = async ({ otp, user_id }: { otp: number; user_id: Types.ObjectId }): Promise<any> => {
      try {
         //  create a new otp if it does not exist
         const getOtp = await this.getOtpByUser({ user_id });

         //   if otp does not exist, create a new one
         if (getOtp?.otp == otp && Number(getOtp?.expires_in) > Date.now()) {
            return { status: true };
         }

         //   set expiry time to 15 minutes
         const expiryTime = new Date();
         expiryTime.setMinutes(expiryTime.getMinutes() + 15);

         if (getOtp?.otp !== otp || getOtp?.expires_in! < expiryTime) {
            return { status: false, message: 'OTP is invalid or expired' };
         }

         return { status: false };
      } catch (err: Error | unknown | any) {
         return { status: false, message: err.message };
      }
   };
}

export default new OtpService();
