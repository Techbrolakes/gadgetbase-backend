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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const AddressControllers = __importStar(require("../controllers/address.controller"));
const AddressValidations = __importStar(require("../validations/address.validation"));
const router = express_1.default.Router();
router.post('/create-address', auth_middleware_1.default, AddressValidations.createAddress, AddressControllers.createAddress);
router.get('/get-addresses', auth_middleware_1.default, AddressControllers.getUserAddresses);
router.get('/get-address/:address_id', auth_middleware_1.default, AddressControllers.getAddress);
router.get('/get-default-address', auth_middleware_1.default, AddressControllers.getUserDefaultAddress);
router.put('/make-address-default/:address_id', auth_middleware_1.default, AddressControllers.makeAddressDefault);
router.put('/update-address/:address_id', auth_middleware_1.default, AddressControllers.updateAddress);
router.delete('/delete-address/:address_id', auth_middleware_1.default, AddressControllers.deleteAddress);
exports.default = router;
