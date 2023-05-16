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
const OrderControllers = __importStar(require("../controllers/order.controller"));
const OrderValidations = __importStar(require("../validations/order.validations"));
const router = express_1.default.Router();
router.post('/create', auth_middleware_1.default, OrderControllers.createPaymentService);
router.post('/pay-on-delivery', auth_middleware_1.default, OrderControllers.payOnDelivery);
router.get('/all-orders', auth_middleware_1.default, OrderControllers.getAllOrders);
router.get('/user-orders', auth_middleware_1.default, OrderControllers.getUserOrders);
router.get('/orders-stats', auth_middleware_1.default, OrderControllers.getOrderStats);
router.put('/change-order-status/:order_id', auth_middleware_1.default, OrderValidations.changeOrderStatus, OrderControllers.changeOrderStatus);
exports.default = router;
