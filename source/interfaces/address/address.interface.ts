import { Document, Types } from 'mongoose';

export interface IAddress {
   user_id: Types.ObjectId;
   first_name: string;
   last_name: string;
   phone_number: string;
   additional_phone_number?: string;
   city: string;
   address: string;
   additional_info?: string;
   primary: boolean;
}

export interface IAddressDocument extends IAddress, Document {}
