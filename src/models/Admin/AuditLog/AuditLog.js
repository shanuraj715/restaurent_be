const mongoose = require("mongoose");

const dbTransactionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE"],
    },
    collectionName: {
      type: String,
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.Mixed, // Can be ObjectId, string, etc.
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // if you have users performing actions
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DBTransactionLog", dbTransactionSchema);
