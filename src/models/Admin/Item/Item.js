const mongoose = require("mongoose");

const Item = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    currencyCode: {
      type: String,
      default: "INR",
    },
    quantity: {
      type: Number,
      required: true,
    },
    categories: {
      type: Array,
      default: [],
      ref: "Category",
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const ItemModel = mongoose.model("Item", Item);
module.exports = ItemModel;
