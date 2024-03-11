import { Schema } from "mongoose";

const cartSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "purchaseItem",
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
