import Product from '../models/productModel.mjs';
import catchAsync from '../ultils/catchAsync.mjs';
import appError from '../ultils/appError.mjs';
import Store from '../models/storeModel.mjs';
import apiFeatures from '../ultils/APIFeatures.mjs';
import User from '../models/userModel.mjs';
import Cart from '../models/cartModel.mjs';
const getOverview = catchAsync(async (req, res) => {
	//EXECUTE QUERY
	if (!req.query.limit) req.query.limit = 16;
	const features = new apiFeatures(Product.find(), req.query)
		.filter()
		.sort()
		.limit()
		.paginate();
	const laptops = await features.query;
	const stores = await Store.find({});
	const pageCurrent = req.query.page || 1;
	res.status(200).render('overview', {
		title: 'Laptop An Phát 2023 Ưu đãi ngập tràn',
		laptops,
		pageCurrent,
		req,
		stores,
	});
});
const getProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findOne({ slug: req.params.slug });
	if (!product) next(new appError('There is no product with that name', 404));

	res.status(200).render('product', {
		title: product.name,
		product,
	});
});
const getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Login to your acount',
	});
};
const getSignupForm = (req, res) => {
	res.status(200).render('signup', {
		title: 'Create your acount',
	});
};
const changePassword = (req, res) => {
	res.status(200).render('changePassword', {
		title: 'My acount',
	});
};
const getMyCart = catchAsync(async (req, res) => {
	let cart;
	if (req.user) {
		const user = await User.findById(req.user._id).populate(['cart']);
		cart = await Cart.findOne({ userId: user._id });
		if (!cart) {
			cart = new Cart({
				userId: user._id,
				items: [],
			});
			cart.save();
		}
	} else {
		return new appError('Need to sign in to view cart', 401);
	}
	res.status(200).render('cart', {
		title: 'My cart',
		products: cart.items,
	});
});

export {
	getOverview,
	getProduct,
	getLoginForm,
	changePassword,
	getSignupForm,
	getMyCart,
};
