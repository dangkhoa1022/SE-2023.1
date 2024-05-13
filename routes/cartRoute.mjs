import express from 'express';

import {
	deleteItemInCart,
	updateCart,
} from '../controllers/purchaseControllers.mjs';

const Router = express.Router();

Router.post('/update', updateCart);
Router.post('/delete', deleteItemInCart);

export default Router;
