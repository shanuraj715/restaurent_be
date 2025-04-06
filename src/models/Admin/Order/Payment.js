const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerAccount", // 👈 Referring customer model
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: {
      type: String,
      required: true,
    },
    provider: { type: String },
    transactionId: { type: String, unique: true, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    refundStatus: {
      type: String,
      enum: ["none", "requested", "processing", "refunded", "rejected"],
      default: "none",
    },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
