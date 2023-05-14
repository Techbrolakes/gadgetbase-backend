"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddress = exports.makeAddressDefault = exports.getUserDefaultAddress = exports.getUserAddresses = void 0;
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const utils_1 = __importDefault(require("../utils"));
const user_service_1 = __importDefault(require("../services/user.service"));
const constants_1 = require("../constants");
const address_service_1 = __importDefault(require("../services/address.service"));
const mongoose_1 = require("mongoose");
const getUserAddresses = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const getUser = await user_service_1.default.getById({ _id: user._id });
        if (!getUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        const address = await address_service_1.default.getAll({ user_id: user._id });
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'User addresses retrieved successfully',
            data: address,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.getUserAddresses = getUserAddresses;
const getUserDefaultAddress = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const defaultAddress = await address_service_1.default.getOne({ $and: [{ user_id: user._id }, { primary: true }] });
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'User default address retrieved successfully',
            data: defaultAddress,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.getUserDefaultAddress = getUserDefaultAddress;
const makeAddressDefault = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        await address_service_1.default.updateAll({ user_id: user._id }, { $set: { primary: false } });
        const update = await address_service_1.default.updateOne({ _id: req.params.address_id }, { $set: { primary: true } });
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'Default address updated successfully',
            data: update,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.makeAddressDefault = makeAddressDefault;
const getAddress = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const getUser = await user_service_1.default.getById({ _id: user._id });
        if (!getUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        const address_id = new mongoose_1.Types.ObjectId(req.params.address_id);
        const getAddress = await address_service_1.default.find({
            $and: [{ user_id: user._id }, { _id: address_id }],
        });
        if (!getAddress) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Address does not exist' });
        }
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'Address retrieved successfully',
            data: getAddress,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.getAddress = getAddress;
const createAddress = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary } = req.body;
        const getUser = await user_service_1.default.getById({ _id: user._id });
        if (!getUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        if (primary) {
            await address_service_1.default.updateAll({ user_id: user._id }, { $set: { primary: false } });
        }
        const newAddress = await address_service_1.default.createAddress({
            user_id: user._id,
            first_name,
            last_name,
            phone_number,
            additional_phone_number,
            additional_info,
            city,
            address,
            primary,
        });
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'Address created successfully',
            data: newAddress,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.createAddress = createAddress;
const updateAddress = async (req, res) => {
    try {
        const { first_name, last_name, phone_number, additional_phone_number, additional_info, city, address, primary } = req.body;
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const getUser = await user_service_1.default.getById({ _id: user._id });
        if (!getUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        const address_id = new mongoose_1.Types.ObjectId(req.params.address_id);
        const getAddress = await address_service_1.default.getAddressById({ address_id });
        if (!getAddress) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Address does not exist' });
        }
        if (primary) {
            await address_service_1.default.updateAll({ user_id: user._id }, { $set: { primary: false } });
        }
        const updatedAddress = await address_service_1.default.atomicUpdate(address_id, {
            $set: {
                first_name,
                last_name,
                phone_number,
                additional_phone_number,
                additional_info,
                city,
                address,
                primary,
            },
        });
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'Address updated successfully',
            data: updatedAddress,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const getUser = await user_service_1.default.getById({ _id: user._id });
        if (!getUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        const address_id = new mongoose_1.Types.ObjectId(req.params.address_id);
        const getAddress = await address_service_1.default.getAddressById({ address_id });
        if (!getAddress) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Address does not exist' });
        }
        const deletedAddress = await address_service_1.default.deleteById(address_id);
        response_handler_1.default.sendSuccessResponse({
            res,
            message: 'Address deleted successfully',
            data: deletedAddress,
        });
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.deleteAddress = deleteAddress;
