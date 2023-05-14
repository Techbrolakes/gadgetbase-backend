"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class OrderService {
    async createOrder({ address, city, first_name, last_name, phone_number, products, status, total_price, user_id, additional_info, additional_phone_number, session, }) {
        const data = { address, city, first_name, last_name, phone_number, products, status, total_price, user_id, additional_info, additional_phone_number };
        const newOrder = await models_1.Order.create([data], { session });
        return newOrder;
    }
}
exports.default = new OrderService();
