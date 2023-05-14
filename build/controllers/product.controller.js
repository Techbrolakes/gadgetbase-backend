"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductCategory = exports.updateProductCategory = exports.getProductCategories = exports.createProductCategory = exports.deleteProduct = exports.updateProduct = exports.getProductByCategory = exports.getProduct = exports.getAllProducts = exports.getProductBrandsByCategoryId = exports.getAllProductBrands = exports.createProduct = void 0;
const response_handler_1 = __importDefault(require("../utils/response-handler"));
const constants_1 = require("../constants");
const product_service_1 = __importDefault(require("../services/product.service"));
const mongoose_1 = require("mongoose");
const createProduct = async (req, res) => {
    try {
        const { category_id, product_name, product_price, product_description, product_image, product_brand, product_quantity } = req.body;
        if (!category_id) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.BAD_REQUEST,
                error: 'Category ID is required',
            });
        }
        const existingCategory = await product_service_1.default.getProductCategoryById({ category_id: new mongoose_1.Types.ObjectId(category_id) });
        if (!existingCategory) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.NOT_FOUND,
                error: 'Category does not exist',
            });
        }
        const existingProductName = await product_service_1.default.getByProductName({ product_name: product_name.toLowerCase() });
        if (existingProductName) {
            return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error: `${product_name} already exist in the database` });
        }
        const product = await product_service_1.default.createProduct({
            category_id,
            product_name: product_name.toLowerCase(),
            product_price,
            product_description,
            product_image,
            product_brand,
            product_quantity,
        });
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.CREATED,
            message: `${product_name} added to the database`,
            data: product,
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
exports.createProduct = createProduct;
const getAllProductBrands = async (req, res) => {
    try {
        const productBrands = await product_service_1.default.getDistinctValues('product_brand');
        const existingProductBrands = productBrands.filter((productBrand) => productBrand !== null);
        if (existingProductBrands.length === 0) {
            return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.NOT_FOUND, error: 'No product brands found' });
        }
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Product brands retrieved successfully',
            data: productBrands,
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
exports.getAllProductBrands = getAllProductBrands;
const getProductBrandsByCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.category_id;
        const existingCategory = await product_service_1.default.getProductCategoryById({ category_id: new mongoose_1.Types.ObjectId(categoryId) });
        if (!existingCategory) {
            return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error: 'Category Id Not Valid' });
        }
        const productBrands = await product_service_1.default.getDistinctValuesByCategoryId('product_brand', new mongoose_1.Types.ObjectId(categoryId));
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Product brands based on categories retrieved successfully',
            data: productBrands,
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
exports.getProductBrandsByCategoryId = getProductBrandsByCategoryId;
const getAllProducts = async (req, res) => {
    try {
        const products = await product_service_1.default.getProducts(req);
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Products retrieved successfully',
            data: products,
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
exports.getAllProducts = getAllProducts;
const getProduct = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        if (!product_id) {
            return response_handler_1.default.sendErrorResponse({
                res,
                code: constants_1.HTTP_CODES.BAD_REQUEST,
                error: 'Product ID is required',
            });
        }
        const product = await product_service_1.default.getProductById({ product_id: new mongoose_1.Types.ObjectId(product_id) });
        if (product) {
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: 'Product retrieved successfully',
                data: product,
            });
        }
    }
    catch (error) {
        response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.getProduct = getProduct;
const getProductByCategory = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const category = await product_service_1.default.getProductByCategoryId(req);
        if (category) {
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: 'Product category retrieved successfully',
                data: category,
            });
        }
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.getProductByCategory = getProductByCategory;
const updateProduct = async (req, res) => {
    try {
        const { category_id, product_name, product_price, product_description, product_image, product_brand, product_quantity } = req.body;
        const product_id = new mongoose_1.Types.ObjectId(req.params.product_id);
        const product = await product_service_1.default.getProductById({ product_id });
        if (!product) {
            return response_handler_1.default.sendErrorResponse({
                code: constants_1.HTTP_CODES.NOT_FOUND,
                error: 'Product does not exist',
                res,
            });
        }
        const updatedProduct = await product_service_1.default.atomicUpdate(product_id, {
            $set: {
                product_name,
                product_price,
                product_description,
                product_image,
                product_brand,
                product_quantity,
                category_id: new mongoose_1.Types.ObjectId(category_id),
            },
        });
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product_id = new mongoose_1.Types.ObjectId(req.params.product_id);
        const product = await product_service_1.default.getProductById({ product_id });
        if (!product) {
            return response_handler_1.default.sendErrorResponse({
                code: constants_1.HTTP_CODES.NOT_FOUND,
                error: 'Product does not exist',
                res,
            });
        }
        await product_service_1.default.deleteProduct(product_id);
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.deleteProduct = deleteProduct;
const createProductCategory = async (req, res) => {
    try {
        const { category_description, category_image, category_name } = req.body;
        const existingCategoryName = await product_service_1.default.getByCategoryName({ category_name: category_name.toLowerCase() });
        if (existingCategoryName) {
            return response_handler_1.default.sendErrorResponse({ res, code: constants_1.HTTP_CODES.BAD_REQUEST, error: `${category_name} category already exist` });
        }
        const category = await product_service_1.default.createProductCategory({
            category_description,
            category_image,
            category_name: category_name.toLowerCase(),
        });
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.CREATED,
            message: `${category_name} Category added to the database`,
            data: category,
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
exports.createProductCategory = createProductCategory;
const getProductCategories = async (req, res) => {
    try {
        const categories = await product_service_1.default.getProductCategories();
        if (categories) {
            return response_handler_1.default.sendSuccessResponse({
                res,
                code: constants_1.HTTP_CODES.OK,
                message: 'Product categories retrieved successfully',
                data: categories,
            });
        }
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.getProductCategories = getProductCategories;
const updateProductCategory = async (req, res) => {
    try {
        const { category_description, category_image, category_name } = req.body;
        const category_id = new mongoose_1.Types.ObjectId(req.params.category_id);
        const category = await product_service_1.default.getProductCategoryById({ category_id });
        if (!category) {
            return response_handler_1.default.sendErrorResponse({
                code: constants_1.HTTP_CODES.NOT_FOUND,
                error: 'Category does not exist',
                res,
            });
        }
        const updatedCategory = await product_service_1.default.atomicCategoryUpdate(category_id, {
            $set: {
                category_description,
                category_image,
                category_name,
            },
        });
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Category updated successfully',
            data: updatedCategory,
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.updateProductCategory = updateProductCategory;
const deleteProductCategory = async (req, res) => {
    try {
        const category_id = new mongoose_1.Types.ObjectId(req.params.category_id);
        const existingCategory = await product_service_1.default.getProductCategoryById({ category_id });
        if (!existingCategory) {
            return response_handler_1.default.sendErrorResponse({
                code: constants_1.HTTP_CODES.NOT_FOUND,
                error: 'Category does not exist',
                res,
            });
        }
        const productWithCategoryId = await product_service_1.default.getProductByCategoryIdOnly({ category_id });
        const deleteCategory = await product_service_1.default.deleteCategory(category_id);
        if (deleteCategory) {
            if (productWithCategoryId.length > 0) {
                for (let i = 0; i < productWithCategoryId.length; i++) {
                    await product_service_1.default.deleteProduct(productWithCategoryId[i]._id);
                }
            }
        }
        return response_handler_1.default.sendSuccessResponse({
            res,
            code: constants_1.HTTP_CODES.OK,
            message: 'Category successfully deleted with all the products in it ',
        });
    }
    catch (error) {
        return response_handler_1.default.sendErrorResponse({
            code: constants_1.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: `${error}`,
            res,
        });
    }
};
exports.deleteProductCategory = deleteProductCategory;
