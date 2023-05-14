"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const models_1 = require("../models");
class ProductService {
    constructor() {
        this.getByProductName = async ({ product_name, leanVersion = true }) => {
            return await models_1.Product.findOne({ product_name }).lean(leanVersion);
        };
        this.getByCategoryName = async ({ category_name, leanVersion = true }) => {
            return await models_1.ProductCategory.findOne({ category_name }).lean(leanVersion);
        };
    }
    async getProducts(req) {
        const { query } = req;
        const search = String(query.search) || '';
        const perpage = Number(query.perpage) || 10;
        const page = Number(query.page) || 1;
        const brand = String(query.brand) || '';
        const minPrice = Number(query.minPrice) || 0;
        const maxPrice = Number(query.maxPrice) || Infinity;
        let filterQuery;
        if (search !== 'undefined' && Object.keys(search).length > 0) {
            filterQuery = {
                $or: [{ product_name: new RegExp(search, 'i') }],
            };
        }
        if (brand !== 'undefined' && brand.length > 0) {
            filterQuery = { ...filterQuery, product_brand: brand };
        }
        const filter = { ...filterQuery, product_price: { $gte: minPrice, $lte: maxPrice } };
        const [products, total] = await Promise.all([
            models_1.Product.find(filter)
                .lean(true)
                .sort({ createdAt: -1 })
                .limit(perpage)
                .skip(page * perpage - perpage),
            models_1.Product.aggregate([{ $match: filter }, { $count: 'count' }]),
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
        return { data: products, pagination };
    }
    async getDistinctValues(fieldName) {
        return await models_1.Product.distinct(fieldName);
    }
    async getDistinctValuesByCategoryId(fieldName, categoryId) {
        return await models_1.Product.distinct(fieldName, { category_id: categoryId });
    }
    async getProductById({ product_id }) {
        return await models_1.Product.findById(product_id);
    }
    async atomicUpdate(product_id, record) {
        return models_1.Product.findOneAndUpdate({ _id: product_id }, { ...record }, { new: true });
    }
    async deleteProduct(product_id) {
        return await models_1.Product.findByIdAndDelete({ _id: product_id });
    }
    async createProduct({ category_id, product_brand, product_description, product_image, product_name, product_price, product_quantity, }) {
        const data = {
            category_id,
            product_brand,
            product_description,
            product_image,
            product_name,
            product_price,
            product_quantity,
        };
        return await models_1.Product.create(data);
    }
    async getProductByCategoryId(req) {
        const { query, params } = req;
        const categoryId = params.category_id;
        const search = String(query.search) || '';
        const brand = String(query.brand) || '';
        const minPrice = Number(query.minPrice) || 0;
        const maxPrice = Number(query.maxPrice) || Infinity;
        const perpage = Number(query.perpage) || 10;
        const page = Number(query.page) || 1;
        let filterQuery = { category_id: new mongoose_1.Types.ObjectId(categoryId) };
        if (search !== 'undefined' && Object.keys(search).length > 0) {
            filterQuery.$or = [{ product_name: new RegExp(search, 'i') }];
        }
        if (brand) {
            filterQuery.product_brand = new RegExp(brand, 'i');
        }
        if (minPrice || maxPrice) {
            filterQuery.product_price = {};
            if (minPrice) {
                filterQuery.product_price.$gte = minPrice;
            }
            if (maxPrice) {
                filterQuery.product_price.$lte = maxPrice;
            }
        }
        const filter = { ...filterQuery };
        const [products, total] = await Promise.all([
            models_1.Product.find(filter)
                .lean(true)
                .sort({ createdAt: -1 })
                .limit(perpage)
                .skip(page * perpage - perpage),
            models_1.Product.aggregate([{ $match: filter }, { $count: 'count' }]),
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
        return { data: products, pagination };
    }
    async getProductByCategoryIdOnly({ category_id }) {
        return await models_1.Product.find({ category_id: category_id }).sort({ createdAt: -1 });
    }
    async getProductCategories() {
        return await models_1.ProductCategory.find();
    }
    async atomicCategoryUpdate(category_id, record) {
        return models_1.ProductCategory.findOneAndUpdate({ _id: category_id }, { ...record }, { new: true });
    }
    async getProductCategoryById({ category_id }) {
        return await models_1.ProductCategory.findById(category_id);
    }
    async deleteCategory(category_id) {
        return await models_1.ProductCategory.findByIdAndDelete({ _id: category_id });
    }
    async createProductCategory({ category_description, category_image, category_name }) {
        const data = {
            category_description,
            category_image,
            category_name,
        };
        return await models_1.ProductCategory.create(data);
    }
}
exports.default = new ProductService();
