import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as ProductControllers from '../controllers/product.controller';
import * as ProductValidations from '../validations/product.validation';

const router = express.Router();

// Products based routes
router.post('/create-product', auth, ProductControllers.createProduct, ProductValidations.createProduct);
router.get('/get-product/:product_id', ProductControllers.getProduct);
router.put('/update-product/:product_id', auth, ProductControllers.updateProduct);
router.delete('/delete-product/:product_id', auth, ProductControllers.deleteProduct);

// Categories based routes
router.post('/create-product-category', auth, ProductControllers.createProductCategory, ProductValidations.createProductCategory);
router.get('/get-product-categories', ProductControllers.getProductCategories);
router.get('/get-product-category/:category_id', ProductControllers.getProductByCategory);
router.delete('/delete-product-category/:category_id', auth, ProductControllers.deleteProductCategory);
router.put('/update-product-category/:category_id', auth, ProductControllers.updateProductCategory);

export default router;
