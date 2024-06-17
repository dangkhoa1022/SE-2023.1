import express from 'express';
import { protect } from '../controllers/authiencationControllers.mjs';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    topSellerProduct,
    updateProduct,
} from '../controllers/productControllers.mjs';

const Router = express.Router();

Router.route('/').get(getAllProducts).post(protect, createProduct);;
Router.route('/top-seller-product').get(topSellerProduct, getAllProducts);
Router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

export default Router;
