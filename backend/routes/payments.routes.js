import express from 'express';
import { authStudent } from '../middlewares/auth.middleware.js'
import { createOrder, verifyPayment } from '../controllers/payments.controller.js';
const router = express.Router();

router.post('/create-order',createOrder);
router.post('/verify-payment',authStudent,verifyPayment);

export default router;