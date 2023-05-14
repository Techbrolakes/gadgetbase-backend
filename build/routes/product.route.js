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
const ProductControllers = __importStar(require("../controllers/product.controller"));
const ProductValidations = __importStar(require("../validations/product.validation"));
const router = express_1.default.Router();
router.post('/create-product', auth_middleware_1.default, ProductControllers.createProduct, ProductValidations.createProduct);
router.get('/get-product/:product_id', ProductControllers.getProduct);
router.get('/get-products', ProductControllers.getAllProducts);
router.get('/get-products-brands', ProductControllers.getAllProductBrands);
router.get('/get-products-brands/:category_id', ProductControllers.getProductBrandsByCategoryId);
router.put('/update-product/:product_id', auth_middleware_1.default, ProductControllers.updateProduct);
router.delete('/delete-product/:product_id', auth_middleware_1.default, ProductControllers.deleteProduct);
router.post('/create-product-category', auth_middleware_1.default, ProductControllers.createProductCategory, ProductValidations.createProductCategory);
router.get('/get-product-categories', ProductControllers.getProductCategories);
router.get('/get-product-category/:category_id', ProductControllers.getProductByCategory);
router.delete('/delete-product-category/:category_id', auth_middleware_1.default, ProductControllers.deleteProductCategory);
router.put('/update-product-category/:category_id', auth_middleware_1.default, ProductControllers.updateProductCategory);
exports.default = router;
