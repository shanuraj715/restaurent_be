const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  paymentMethod: {
    type: String,
    // enum: ["card", "upi", "netbanking", "cod"],
    required: true,
  },
  provider: { type: String }, // e.g., Razorpay, Stripe, Paytm, etc.

  transactionId: { type: String, unique: true, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },

  refundStatus: {
    type: String,
    enum: ["none", "requested", "processing", "refunded", "rejected"],
    default: "none",
  },
  refundAmount: { type: Number, default: 0 },
  refundDate: { type: Date },

  paidAt: { type: Date }, // When the payment actually succeeded
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
