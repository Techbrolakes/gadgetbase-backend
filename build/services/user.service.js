"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.createUser = async (user) => {
            if (user.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                const hash = await bcrypt_1.default.hash(user.password, salt);
                user.password = hash;
            }
            const newUser = new models_1.User(user);
            return await newUser.save();
        };
        this.getById = async ({ _id, leanVersion = true }) => {
            return models_1.User.findOne({ _id }).lean(leanVersion);
        };
        this.getByEmail = async ({ email, leanVersion = true }) => {
            return models_1.User.findOne({ email }).lean(leanVersion);
        };
    }
    async getByQuery(query, select = '') {
        return models_1.User.findOne(query).select(select);
    }
    async atomicUpdate(user_id, record, session = null) {
        return models_1.User.findOneAndUpdate({ _id: user_id }, { ...record }, { new: true, session });
    }
    async updateAll(query, record) {
        return await models_1.User.updateMany({ ...query }, { ...record }, { new: true });
    }
}
exports.default = new UserService();
