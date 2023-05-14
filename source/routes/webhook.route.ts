import express from 'express';
import auth from '../middlewares/auth.middleware';
import * as paystackWebhookControllers from '../controllers/webhooks/paystack.webhook';

const router = express.Router();

router.post('/paystack', auth, paystackWebhookControllers.paystackWebhook);

export default router;
