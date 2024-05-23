import mongoose, { Schema } from "mongoose";
import autopopulate from "mongoose-autopopulate";
const cartSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "PurchaseItem",
      autopopulate: true,
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Enable autopopulation for the 'posts' field
cartSchema.plugin(autopopulate);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
