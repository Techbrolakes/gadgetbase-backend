"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class AddressService {
    async createAddress({ first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary, user_id, }) {
        const data = { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary, user_id };
        return await models_1.Address.create(data);
    }
    async deleteById(address_id) {
        return models_1.Address.findByIdAndDelete({ _id: address_id });
    }
    async find(query, populate = '') {
        return await models_1.Address.find(query).populate(populate).sort({ createdAt: -1 });
    }
    async getOne(query) {
        return models_1.Address.findOne({ ...query });
    }
    async getAll(query) {
        return models_1.Address.find({ ...query }).sort({ createdAt: -1 });
    }
    async updateOne(query, record) {
        return await models_1.Address.findOneAndUpdate({ ...query }, { ...record }, { new: true });
    }
    async updateAll(query, record) {
        return await models_1.Address.updateMany({ ...query }, { ...record }, { new: true });
    }
    async getAddressById({ address_id }) {
        return await models_1.Address.findById(address_id);
    }
    async atomicUpdate(address_id, record) {
        return models_1.Address.findOneAndUpdate({ _id: address_id }, { ...record }, { new: true });
    }
}
exports.default = new AddressService();
