import { Types } from 'mongoose';
import { IAddress, IAddressDocument } from '../interfaces/address/address.interface';
import { Address } from '../models';

class AddressService {
   // create an address
   public async createAddress({
      first_name,
      last_name,
      phone_number,
      additional_phone_number,
      additional_info,
      city,
      address,
      primary,
      user_id,
   }: IAddress): Promise<IAddressDocument | null> {
      const data = { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary, user_id };

      return await Address.create(data);
   }

   // Deletes an address
   public async deleteById(address_id: Types.ObjectId): Promise<IAddressDocument | null> {
      return Address.findByIdAndDelete({ _id: address_id });
   }

   // find an address
   public async find(query: any, populate: string = ''): Promise<IAddressDocument | null | any> {
      return await Address.find(query).populate(populate).sort({ createdAt: -1 });
   }

   // find an address
   public async getOne(query: any): Promise<IAddressDocument | null> {
      return Address.findOne({ ...query });
   }

   // find all address
   public async getAll(query: any): Promise<IAddressDocument | null | any> {
      return Address.find({ ...query }).sort({ createdAt: -1 });
   }

   // update an address
   public async updateOne(query: any, record: any): Promise<IAddressDocument | null> {
      return await Address.findOneAndUpdate({ ...query }, { ...record }, { new: true });
   }

   // update all address
   public async updateAll(query: any, record: any): Promise<IAddressDocument | null | any> {
      return await Address.updateMany({ ...query }, { ...record }, { new: true });
   }

   // Get Address By Id
   public async getAddressById({ address_id }: { address_id: Types.ObjectId }): Promise<IAddressDocument | null> {
      return await Address.findById(address_id);
   }

   public async atomicUpdate(address_id: Types.ObjectId, record: any) {
      return Address.findOneAndUpdate({ _id: address_id }, { ...record }, { new: true });
   }
}

export default new AddressService();
