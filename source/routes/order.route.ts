import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as OrderControllers from '../controllers/order.controller';

const router = express.Router();

router.post('/create', auth, OrderControllers.createPaymentService);
router.post('/pay-on-delivery', auth, OrderControllers.payOnDelivery);

export default router;
