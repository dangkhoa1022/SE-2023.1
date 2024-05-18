import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const orderSchema = new Schema({
	totalPrice: {
		type: Number,
		required: true,
	},
	paid: {
		type: Boolean,
		required: true,
		default: false,
	},
	paymentMethod: {
		type: String,
		required: true,
		default: 'COD',
	},
	createdDay: {
		type: Date,
		default: Date.now, // Set default value to current date
	},
	rejectedDay: {
		type: Date,
		require: false,
	},
	isRefund: {
		type: Boolean,
		require: false,
	},
	arrivedDay: {
		type: Date,
		default: function () {
			// Calculate the date 3-4 days later
			const currentDate = new Date();
			const daysToAdd = Math.floor(Math.random() * 2) + 3; // Randomly select 3 or 4 days
			const futureDate = new Date(
				currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000,
			);
			return futureDate;
		},
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	receiverName: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	note: {
		type: String,
		default: 'Không có',
	},
	orderStatus: {
		type: String,
		required: true,
		default: 'pending',
	},
	deliveryFee: {
		type: Number,
		required: true,
		default: 100000,
	},
	items: [
		{
			type: Schema.Types.ObjectId,
			ref: 'PurchaseItem',
			autopopulate: true,
		},
	],
});

// Enable autopopulation for the 'posts' field
orderSchema.plugin(autopopulate);

const Order = mongoose.model('Order', orderSchema);

export default Order;
