"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategorySchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProductCategorySchema = new mongoose_1.Schema({
    category_name: { type: String, required: true },
    category_image: { type: String },
    category_description: { type: String },
}, {
    timestamps: true,
});
