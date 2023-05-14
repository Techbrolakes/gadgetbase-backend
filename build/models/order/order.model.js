"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const order_interface_1 = require("../../interfaces/order/order.interface");
exports.OrderSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    additional_phone_number: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    additional_info: { type: String },
    status: { type: String, enum: Object.values(order_interface_1.IStatus), required: true, default: order_interface_1.IStatus.pending },
    products: [
        {
            product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
            product_name: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    total_price: { type: Number, required: true },
}, {
    timestamps: true,
});
