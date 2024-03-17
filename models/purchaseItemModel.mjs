import mongoose, { Schema } from "mongoose";
import autopopulate from "mongoose-autopopulate";

const purchaseItemSchema = new Schema({
  quantity: {
    required: true,
    type: Number,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Laptop",
    autopopulate: true,
  },
  currentPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
});

// Enable autopopulation for the 'posts' field
purchaseItemSchema.plugin(autopopulate);

const PurchaseItem = mongoose.model("PurchaseItem", purchaseItemSchema);

export default PurchaseItem;
