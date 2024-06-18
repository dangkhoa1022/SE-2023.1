import express from 'express';
import { protect } from '../controllers/authiencationControllers.mjs';
import {
	checkOutSession,
	createOrder,
	updateOrder,
	createOrderStripe,
} from '../controllers/purchaseControllers.mjs';

const router = express.Router();

router.get('/checkout-session/:total', checkOutSession);
router.post('/create', createOrder);
router.get('/create-stripe', createOrderStripe);

router.post('/update', updateOrder);

export default router;
