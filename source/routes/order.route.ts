import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as OrderControllers from '../controllers/order.controller';
import * as OrderValidations from '../validations/order.validations';

const router = express.Router();

router.post('/create', auth, OrderControllers.createPaymentService);
router.post('/pay-on-delivery', auth, OrderControllers.payOnDelivery);
router.get('/all-orders', auth, OrderControllers.getAllOrders);
router.get('/user-orders', auth, OrderControllers.getUserOrders);
router.get('/orders-stats', auth, OrderControllers.getOrderStats);
router.put('/change-order-status/:order_id', auth, OrderValidations.changeOrderStatus, OrderControllers.changeOrderStatus);

export default router;
