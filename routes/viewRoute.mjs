import express from 'express';
import {
    getLoginForm,
    getOverview,
    getProduct,
    getSignupForm,
    getMyCart,
    changePassword,
    getManageProduct,
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
Router.get('/changePassword', protect, changePassword);
Router.get('/manage', adminOnly, getManageProduct);
Router.get('/:slug', getProduct);
Router.route('/').get(getOverview);
export default Router;
