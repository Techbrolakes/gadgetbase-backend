import { Document, Types } from 'mongoose';

export interface IVerifyMail {
   email: string;
   otp: number;
}

export interface IRegister {
   first_name: string;
   last_name: string;
   email: string;
   password: string;
}

export interface IGetByEmail {
   email: string;
   leanVersion?: boolean;
}
export interface IGetById {
   _id: Types.ObjectId;
   leanVersion?: boolean;
}

export interface IUser {
   first_name?: string;
   last_name?: string;
   phone_number?: string;
   email?: string;
   password?: string;
}

export interface IUserDocument extends IUser, Document {}
