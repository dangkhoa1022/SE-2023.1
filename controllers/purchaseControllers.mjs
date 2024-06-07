import User from '../models/userModel.mjs';
import catchAsync from '../ultils/catchAsync.mjs';
import Stripe from 'stripe';
import PurchaseItem from '../models/purchaseItemModel.mjs';
import Cart from '../models/cartModel.mjs';
import Order from '../models/orderModel.mjs';

const addItemToCart = catchAsync(async (req, res, next) => {
	const { userId, itemId } = req.body;
	let cart = await Cart.findOne({
		userId,
	}).populate('items');
	if (!cart) {
		cart = new Cart({
			userId,
			items: [itemId],
		});
		await cart.save();
		return res.status(200).json({
			status: 'success',
		});
	}
	const products = cart.items.map((i) => i.product._id.toString());
	if (!products.includes(itemId)) {
		let purchaseItem = new PurchaseItem({
			quantity: 1,
			product: itemId,
		});
		purchaseItem = await purchaseItem.save();

		cart.items.push(purchaseItem.id);
		await cart.save();
	}

	res.status(200).json({
		status: 'success',
	});
});

const deleteItemInCart = catchAsync(async (req, res, next) => {
	const { deletedIds, cartId } = req.body;
	if (cartId) {
		const cart = await Cart.findById(cartId);
		console.log(cart.items.map((item) => item._id));
		console.log(deletedIds);
		cart.items = cart.items.filter(
			(item) => !deletedIds.includes(item._id.toString()),
		);
		cart.save();
		console.log(cart.items.length);
	} else {
		const promises = deletedIds.map(async (id) => {
			return await PurchaseItem.findByIdAndDelete(id);
		});
		await Promise.all(promises);
	}
	res.redirect('/mycart').status(200).json({
		status: 'success',
	});
});
const stripe = new Stripe(
	'sk_test_51MpCA0DfcEM9cIAm0SlXbB7WjZpXe7HEwSwCAjde0FZoLndTIYUnHJsp5F5HEcyEUpCy9zJiU2OIIFRf2t5KNnXx00PnlNRkfx',
);
const checkOutSession = catchAsync(async (req, res) => {
	const price = req.params.total;
	//2. Create checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get(
			'host',
		)}/api/purchase/create-stripe?query=${req.query.query}`,
		cancel_url: `${req.protocol}://${req.get('host')}/mycart`,
		line_items: [
			{
				price_data: {
					currency: 'vnd',
					unit_amount: price,
					product_data: {
						name: `Thanh toán giỏ hàng`,

						images: [`${req.protocol}://${req.get('host')}/purchase.jpg`],
					},
				},
				quantity: 1,
			},
		],
		mode: 'payment',
	});
	//3. Create session as response
	res.status(201).json({
		status: 'success',
		session,
	});
});

const updateCart = catchAsync(async (req, res, next) => {
	const { updatedItems } = req.body;
	console.log(updatedItems);
	let promises = updatedItems.map(async (item) => {
		return await PurchaseItem.findByIdAndUpdate(item.id, {
			$set: {
				quantity: parseInt(item.quantity),
			},
		});
	});

	await Promise.all(promises);
	res.status(201).json({
		status: 'success',
	});
});

const createOrder = catchAsync(async (req, res, next) => {
	console.log(req.body);
	const newOrder = new Order({
		...req.body,
		userId: req.user._id,
	});
	await newOrder.save();
	res.status(201).redirect('/myorder');
});

const createOrderStripe = catchAsync(async (req, res, next) => {
	console.log(req.query);
	let body = JSON.parse(req.query.query);

	const deletedIds = body.items;

	const cart = await Cart.findOne({
		userId: req.user._id,
	});
	cart.items = cart.items.filter(
		(item) => !deletedIds.includes(item._id.toString()),
	);
	cart.save();

	const newOrder = new Order({
		...body,
		userId: req.user._id,
		paid: true,
	});
	await newOrder.save();
	res.status(201).redirect('/myorder');
});

const updateOrder = catchAsync(async (req, res, next) => {
	console.log(req.body);
	await Order.findByIdAndUpdate(req.body.id, {
		...req.body,
	});
	res.status(201).json({
		status: 'success',
	});
});

export {
	checkOutSession,
	deleteItemInCart,
	addItemToCart,
	updateCart,
	createOrder,
	updateOrder,
	createOrderStripe,
};
