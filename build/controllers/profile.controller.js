"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.editProfile = exports.resetPassword = void 0;
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const utils_1 = __importDefault(require("../utils"));
const user_service_1 = __importDefault(require("../services/user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const resetPassword = async (req, res) => {
    try {
        const user_id = utils_1.default.throwIfUndefined(req.user, 'req.user')._id;
        const { current_password, new_password, confirm_password } = req.body;
        const user = await user_service_1.default.getById({ _id: user_id });
        if (!user) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        const result = bcrypt_1.default.compareSync(current_password, user?.password);
        if (!result) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: 404,
                error: 'Current password is incorrect.',
            });
        }
        if (new_password !== confirm_password) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'Password does not match' });
        }
        const password = bcrypt_1.default.hashSync(new_password, 10);
        const saved = await user_service_1.default.atomicUpdate(user_id, { $set: { password: password } });
        if (saved) {
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: 200,
                message: 'User Successfully updated',
            });
        }
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.resetPassword = resetPassword;
const editProfile = async (req, res) => {
    try {
        const user_id = utils_1.default.throwIfUndefined(req.user, 'req.user')._id;
        Object.keys(req.body).forEach((e) => req.body[e] == '' && delete req.body[e]);
        const user = await user_service_1.default.atomicUpdate(user_id, req.body);
        if (user) {
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: 200,
                message: 'User Successfully updated',
                data: user,
            });
        }
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.editProfile = editProfile;
const getAllUsers = async (req, res) => {
    try {
        const user = utils_1.default.throwIfUndefined(req.user, 'req.user');
        const getUser = await user_service_1.default.getById({ _id: user._id });
        if (!getUser) {
            return response_handler_1.default.sendErrorResponse({ res, code: 404, error: 'User does not exist' });
        }
        const profile = await user_service_1.default.getByQuery({ _id: user._id }, 'first_name last_name email  gender address');
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: 200,
            message: 'User Successfully fetched',
            data: profile,
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({ res, code: 500, error: `${error}` });
    }
};
exports.getAllUsers = getAllUsers;
