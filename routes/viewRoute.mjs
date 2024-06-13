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
    manageProfit,
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
Router.get('/mycart', getMyCart);
Router.get('/myorder', getMyOrder);
Router.get('/changePassword', protect, changePassword);
Router.get('/manageOrder', manageOrder);
Router.get('/manage', adminOnly, getManageProduct);
Router.get('/manageProfit', manageProfit);
Router.get('/:slug', getProduct);
Router.route('/').get(getOverview);



export default Router;
