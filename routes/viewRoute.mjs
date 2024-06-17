import express from 'express';
import {
	getLoginForm,
	getOverview,
	getProduct,
	getSignupForm,
	getMyCart,
	changePassword,
	getManageProduct,
	getMyOrder,
	manageOrder,
} from '../controllers/viewControllers.mjs';
import {
	isLoggedIn,
	protect,
	adminOnly,
} from '../controllers/authiencationControllers.mjs';

const Router = express.Router();
Router.get('/login', getLoginForm);
Router.get('/signup', getSignupForm);
Router.use(isLoggedIn);
Router.get('/my-cart', getMyCart);
Router.get('/my-order', getMyOrder);
Router.get('/change-password', protect, changePassword);
Router.get('/manage-order', adminOnly, manageOrder);
Router.get('/manage-product', adminOnly, getManageProduct);
Router.get('/:slug', getProduct);
Router.route('/').get(getOverview);

export default Router;
