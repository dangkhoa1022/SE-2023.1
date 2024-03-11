import { Schema } from "mongoose";

const purchaseItemSchema = new Schema({
  quantity: {
    required: true,
    type: Number,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Laptop",
  },
  currentPrice: {
    type: Number,
    required: true,
  },
});
const PurchaseItem = mongoose.model("PurchaseItem", purchaseItemSchema);

export default PurchaseItem;
