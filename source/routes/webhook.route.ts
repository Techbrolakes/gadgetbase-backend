import express from 'express';
import * as paystackWebhookControllers from '../controllers/webhooks/paystack.webhook';

const router = express.Router();

router.post('/paystack', paystackWebhookControllers.paystackWebhook);

export default router;
