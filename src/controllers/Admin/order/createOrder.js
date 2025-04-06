const Order = require("../../../models/Admin/Order/Order");
const Payment = require("../../../models/Admin/Order/Payment");
const Item = require("../../../models/Admin/Item/Item");
const {
  successResp,
  failResp,
  logDbTransaction,
  isValidObjectId,
} = require("../../../utils");

/**
 * items: type array
 * structure: [{ item: "itemId", quantity: 2 }]
 */

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      orderType, // delivery, pickeu, dine_in
      tableNumber, // optional
      paymentMethod,
      provider = null, // it can be optional if only one payment gateway is used
    } = req.body;

    console.log(items);

    // check if items is not present in the request body
    if (!items || items.length === 0) {
      return failResp(
        res,
        400,
        "At least one item must be present in the order",
        "ORDER_VALIDATION_ERROR"
      );
    }

    const validItemsIds = items.filter((item) => isValidObjectId(item.id));

    if (!paymentMethod) {
      return failResp(
        res,
        400,
        "Missing required order fields",
        "ORDER_VALIDATION_ERROR"
      );
    }

    console.log("VALIDITEMIDS", validItemsIds);

    // Step 1: Calculate total amount
    let totalAmount = 0;
    const foundItems = await Item.find({
      _id: { $in: validItemsIds.map((item) => item.id) },
    });

    if (foundItems.length !== validItemsIds.length) {
      return failResp(
        res,
        404,
        "One or more items not found or Out of stock",
        "ITEM_NOT_FOUND"
      );
    }

    console.log("foundItems", foundItems);

    for (const foundItem of foundItems) {
      const matchedItem = items.find((i) => i.item === String(foundItem._id));
      const quantity = matchedItem?.quantity || 1;

      if (quantity > foundItem.quantity) {
        return failResp(
          res,
          400,
          `Requested quantity for item '${foundItem.itemName}' exceeds available stock.`,
          "ITEM_NOT_FOUND"
        );
      }

      totalAmount += foundItem.price * quantity;
    }

    // Step 2: Reduce item stock quantity
    const bulkUpdates = foundItems.map((foundItem) => {
      const matchedItem = items.find((i) => i.item === String(foundItem._id));
      const quantity = matchedItem?.quantity || 1;

      return {
        updateOne: {
          filter: { _id: foundItem._id },
          update: { $inc: { quantity: -quantity } },
        },
      };
    });

    await Item.bulkWrite(bulkUpdates);

    // Step 3: Create Order
    const customerId = req.tokenUserData?.id;

    const newOrder = new Order({
      customerId,
      items,
      orderType,
      tableNumber: orderType === "dine_in" ? tableNumber : null,
      totalAmount,
      createdBy:
        req.tokenUserData?.role !== "customer" ? req.tokenUserData?.id : null,
      paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
    });

    const savedOrder = await newOrder.save();

    // Step 3: Create Payment
    const newPayment = new Payment({
      userId: customerId,
      orderId: savedOrder._id,
      amount: totalAmount,
      paymentMethod,
      provider,
      transactionId: `TXN-${Date.now()}-${customerId}`,
      paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
    });

    const savedPayment = await newPayment.save();

    // Log transaction
    await logDbTransaction(
      "CREATE",
      "Order",
      savedOrder._id,
      req.tokenUserData?.id,
      "Order created"
    );

    return successResp(
      res,
      201,
      { order: savedOrder, payment: savedPayment },
      "Successfully created order"
    );
  } catch (error) {
    console.error("Create Order Error:", error);
    return failResp(res, 500, "Internal Server Error", "ORDER_CREATION_FAILED");
  }
};
