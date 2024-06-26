import express from 'express';
import {
	forgotPassword,
	isLoggedIn,
	login,
	logout,
	protect,
	resetPassword,
	signup,
	updatePassword,
} from '../controllers/authiencationControllers.mjs';
import { addItemToCart } from '../controllers/purchaseControllers.mjs';
import {
	getAllUsers,
	getMe,
	getOneUser,
	updateUser,
} from '../controllers/userControllers.mjs';

const Router = express.Router();
Router.route('/signup').post(signup);
Router.route('/login').post(login);
Router.route('/logout').post(logout);
Router.route('/forgotPassword').post(forgotPassword);
Router.route('/resetPassword/:token').patch(resetPassword);
Router.route('/purchase').patch(isLoggedIn, addItemToCart);

Router.use(protect);
Router.route('/updatePassword').patch(updatePassword);
Router.route('/updateMe').patch(getMe, updateUser);
Router.route('/me').get(getMe, getOneUser);

Router.route('/').get(getAllUsers);
Router.route('/:id').get(getOneUser);

export default Router;
