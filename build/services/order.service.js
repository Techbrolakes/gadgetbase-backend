"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
class OrderService {
    async createOrder({ address, city, first_name, last_name, phone_number, products, status, total_price, user_id, additional_info, additional_phone_number, session, }) {
        const data = { address, city, first_name, last_name, phone_number, products, status, total_price, user_id, additional_info, additional_phone_number };
        const newOrder = await models_1.Order.create([data], { session });
        return newOrder;
    }
    async getAll(req) {
        const { query } = req;
        const search = String(query.search) || '';
        const perpage = Number(query.perpage) || 10;
        const status = String(query.status) || '';
        const page = Number(query.page) || 1;
        let filterQuery;
        if (search !== 'undefined' && Object.keys(search).length > 0) {
            filterQuery = {
                $or: [{ first_name: new RegExp(search, 'i') }],
            };
        }
        if (status !== 'undefined' && status.length > 0) {
            filterQuery = { ...filterQuery, status: status };
        }
        const filter = { ...filterQuery };
        const [orders, total] = await Promise.all([
            models_1.Order.find(filter)
                .lean(true)
                .sort({ createdAt: -1 })
                .limit(perpage)
                .skip(page * perpage - perpage),
            models_1.Order.aggregate([{ $match: filter }, { $count: 'count' }]),
        ]);
        const pagination = {
            hasPrevious: page > 1,
            prevPage: page - 1,
            hasNext: page < Math.ceil(total[0]?.count / perpage),
            next: page + 1,
            currentPage: Number(page),
            total: total[0]?.count || 0,
            pageSize: perpage,
            lastPage: Math.ceil(total[0]?.count / perpage),
        };
        return { data: orders, pagination };
    }
    async getAllUserOrders(req) {
        const { query } = req;
        const search = String(query.search) || '';
        const perpage = Number(query.perpage) || 10;
        const status = String(query.status) || '';
        const page = Number(query.page) || 1;
        let filterQuery;
        if (search !== 'undefined' && Object.keys(search).length > 0) {
            filterQuery = {
                $or: [{ first_name: new RegExp(search, 'i') }],
            };
        }
        if (status !== 'undefined' && status.length > 0) {
            filterQuery = { ...filterQuery, status: status };
        }
        const filter = { ...filterQuery, user_id: new mongoose_1.Types.ObjectId(req.user?._id) };
        const [orders, total] = await Promise.all([
            models_1.Order.find(filter)
                .lean(true)
                .sort({ createdAt: -1 })
                .limit(perpage)
                .skip(page * perpage - perpage),
            models_1.Order.aggregate([{ $match: filter }, { $count: 'count' }]),
        ]);
        const pagination = {
            hasPrevious: page > 1,
            prevPage: page - 1,
            hasNext: page < Math.ceil(total[0]?.count / perpage),
            next: page + 1,
            currentPage: Number(page),
            total: total[0]?.count || 0,
            pageSize: perpage,
            lastPage: Math.ceil(total[0]?.count / perpage),
        };
        return { data: orders, pagination };
    }
    async findAll(populate = '') {
        return await models_1.Order.find().populate(populate).sort({ createdAt: -1 });
    }
    async findWithQuery(query, populate = '') {
        return await models_1.Order.find(query).populate(populate).sort({ createdAt: -1 });
    }
    async changeStatus(order_id) {
        return await models_1.Order.findByIdAndUpdate({ _id: order_id });
    }
    async deleteProduct(order_id) {
        return await models_1.Order.findByIdAndDelete({ _id: order_id });
    }
    async atomicUpdate(order_id, record) {
        return await models_1.Order.findOneAndUpdate({ _id: order_id }, { ...record }, { new: true });
    }
}
exports.default = new OrderService();
