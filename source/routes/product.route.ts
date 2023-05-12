import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as ProductControllers from '../controllers/product.controller';
import * as ProductValidations from '../validations/product.validation';

const router = express.Router();

router.post('/create-product', auth, ProductControllers.createProduct, ProductValidations.createProduct);
router.post('/create-product-category', auth, ProductControllers.createProductCategory, ProductValidations.createProductCategory);
router.get('/get-product-categories', ProductControllers.getProductCategories);
router.get('/get-product-category/:category_id', ProductControllers.getProductByCategory);
router.put('/edit-product/:product_id', auth, ProductControllers.updateProduct);
router.delete('/delete-product/:product_id', auth, ProductControllers.deleteProduct);

export default router;
