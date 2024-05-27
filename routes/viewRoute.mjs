import express from 'express';
import {
	getLoginForm,
	getOverview,
	getProduct,
	getSignupForm,
	getMyCart,
	changePassword,
	getMyOrder,
	manageOrder,
} from '../controllers/viewControllers.mjs';
import {
	isLoggedIn,
	protect,
} from '../controllers/authiencationControllers.mjs';
const Router = express.Router();
Router.get('/login', getLoginForm);
Router.get('/signup', getSignupForm);
Router.use(isLoggedIn);
Router.get('/mycart', getMyCart);
Router.get('/myorder', getMyOrder);
Router.get('/changePassword', protect, changePassword);
Router.route('/').get(getOverview);
Router.get('/manageOrder', manageOrder);
Router.get('/:slug', getProduct);


export default Router;
