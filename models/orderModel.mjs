import { Schema } from "mongoose";

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
  },
  createdDay: {
    type: Date(),
  },
  requestedDay: {
    type: Date(),
  },
  arrivedDay: {
    type: Date(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "purchaseItem",
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
