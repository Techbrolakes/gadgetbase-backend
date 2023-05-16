import { Types } from 'mongoose';
import otpService from '../services/otp.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import path from 'path';
// const Email = require('keystone-email');
dotenv.config();

class UtilsFunc {
   // Throw error if value is undefined
   public static generateRef({ length }: { length: number }) {
      let result = '';
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }

   // SEND EMAIL
   // public static async sendEmail(TEMPLATE: any, { to = [] as any, subject = '', props = {}, attachment = null }) {
   //    const cb = (err: any, info: any) => {
   //       if (err) {
   //          console.log(err, ':=> Error Response =Mailer');
   //          return false;
   //       }
   //       console.log(info, ':=> Info Response = Mailer');
   //       return true;
   //    };
   //    let mailOptions = {
   //       apiKey: '7f3d10eebc6936ec4c44998fcce538b2-913a5827-fd327ddb',
   //       domain: 'sandboxd35f84cbdf884016890947758e677c8f.mailgun.org',
   //       to: to,
   //       from: {
   //          name: 'GadgetBase',
   //          email: 'lekandar11@gmail.com',
   //       },
   //       subject: subject,
   //       attachment,
   //    };

   //    return new Email(path.join(__dirname, `../views/${TEMPLATE}`), {
   //       transport: 'mailgun',
   //    }).send(
   //       { ...props },
   //       mailOptions,
   //       function (err: any, result: any) {
   //          if (err) {
   //             console.log('🤕 Mailgun test failed with error:\n', err);
   //          } else {
   //             console.log('📬 Successfully sent Mailgun test with result:\n', result);
   //          }
   //       },
   //       cb,
   //    );
   // }

   // Generate Transaction Reference
   public static generateTXRef() {
      const prefix = 'GADGETBASE_TX_REF';
      const key = prefix + this.generateRef({ length: 12 });
      return key.toUpperCase();
   }

   // Generate Transaction Hash
   public static generateTXHash() {
      const prefix = 'GADGETBASE_HASH_REF';
      const key = prefix + this.generateRef({ length: 12 });
      return key.toUpperCase();
   }

   // Generate OTP
   public static generateOtp = async ({ user_id }: { user_id: Types.ObjectId }) => {
      const otp = Math.floor(Math.random() * 8999 + 1000);
      const ttl = 15 * 60 * 1000;
      const expires_in = new Date(Date.now() + ttl);

      const check_otp = await otpService.getOtpByUser({ user_id });
      if (!check_otp) {
         return otpService.createOtp({ otp, expires_in, user_id });
      } else {
         return otpService.updateOtp({ otp, expires_in, user_id });
      }
   };

   /** Generate and sign a user Token */
   public static generateToken = (data: any) => {
      return jwt.sign(data, process.env.JWT_SECRET || 'jwt', {
         expiresIn: '30d',
      });
   };

   public static throwIfUndefined = <T>(x: T | undefined, name: string = 'Value'): T => {
      if (x === undefined) {
         throw new Error(`${name} must not be undefined`);
      }
      return x;
   };

   /** Generate and verify a user Token */
   public static verifyToken = async (token: string, secret = process.env.JWT_SECRET || 'jwt') => {
      try {
         const decoded = await jwt.verify(token, secret);
         return decoded;
      } catch (err: any) {
         if (err instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
         } else if (err instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
         } else {
            throw new Error('Failed to verify token');
         }
      }
   };
}

export default UtilsFunc;
