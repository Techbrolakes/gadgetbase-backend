"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.paystackAPI = {
    client: async () => {
        const app = axios_1.default.create({
            baseURL: process.env.PAYSTACK_BASE_API_URl,
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return app;
    },
    initializeTransaction: async (body) => {
        try {
            const apiCall = await exports.paystackAPI.client();
            const res = await apiCall.post(`/transaction/initialize`, {
                ...body,
            });
            if (res?.data?.Data)
                return res.data.Data;
            return res?.data;
        }
        catch (e) {
            return Promise.reject(e);
        }
    },
    verifyTransaction: async (reference) => {
        try {
            const apiCall = await exports.paystackAPI.client();
            const res = await apiCall.get(`/transaction/verify/${reference}`);
            if (res?.data?.Data)
                return res.data.Data;
            return res?.data;
        }
        catch (e) {
            if (e?.response?.data)
                return Promise.reject(String(e?.response?.data?.message));
            return Promise.reject(e);
        }
    },
};
