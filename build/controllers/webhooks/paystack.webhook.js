"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackWebhook = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const response_handler_1 = __importDefault(require("../../utils/response-handler"));
const constants_1 = require("../../constants");
const dotenv_1 = __importDefault(require("dotenv"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const paystack_1 = require("../../integrations/paystack");
const order_controller_1 = require("../order.controller");
dotenv_1.default.config();
const paystackWebhook = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const { event } = req.body;
        if (event === 'charge.success') {
            const hash = crypto_1.default.createHmac('sha512', String(process.env.PAYSTACK_SECRET_KEY)).update(JSON.stringify(req.body)).digest('hex');
            const { id, reference, metadata } = req.body.data;
            if (hash !== req.headers['x-paystack-signature']) {
                return response_handler_1.default.sendErrorResponse({
                    res,
                    code: constants_1.HTTP_CODES.UNAUTHORIZED,
                    error: 'Not valid webhook signature',
                });
            }
            const getUser = await user_service_1.default.getById({ _id: metadata.user_id });
            if (!getUser) {
                return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
            }
            const e = await paystack_1.paystackAPI.verifyTransaction(reference);
            const data = e.data;
            if (e.status) {
                try {
                    const payload = {
                        first_name: data.metadata.first_name,
                        last_name: data.metadata.last_name,
                        phone_number: data.metadata.phone_number,
                        user_id: data.metadata.user_id,
                        additional_phone_number: data.metadata.additional_phone_number,
                        additional_info: data.metadata.additional_info,
                        city: data.metadata.city,
                        address: data.metadata.address,
                        total_price: data.metadata.total_price,
                        products: data.metadata.products,
                    };
                    const result = await (0, order_controller_1.createNewOrder)(payload);
                    console.log('It got here');
                    if (!result.success) {
                        await session.abortTransaction();
                        return response_handler_1.default.sendErrorResponse({
                            res,
                            code: constants_1.HTTP_CODES.BAD_REQUEST,
                            error: 'Transactions aborted',
                        });
                    }
                    await session.commitTransaction();
                    await session.endSession();
                    return response_handler_1.default.sendSuccessResponse({
                        res,
                        code: constants_1.HTTP_CODES.OK,
                        message: 'Successful',
                    });
                }
                catch (error) {
                    return response_handler_1.default.sendErrorResponse({
                        res,
                        code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
                        error: `${error}`,
                    });
                }
                finally {
                    await session.endSession();
                }
            }
        }
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            res,
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
        });
    }
};
exports.paystackWebhook = paystackWebhook;
