const Order = require("../../../models/Admin/Order/Order");
const Item = require("../../../models/Admin/Item/Item");
const { successResp, failResp, logDbTransaction } = require("../../../utils");

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.query;
    const updateData = req.body;

    console.log(updateData);

    // Fetch current order
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return failResp(res, 404, "Order not found2", "ORDER_NOT_FOUND");
    }

    if (existingOrder.orderStatus === "cancelled") {
      // prevent this order to be uopdated because it is already cancelled
      return failResp(
        res,
        400,
        "Cancelled orders cannot be updated",
        "CANCELLED_ORDER_STATUS"
      );
    }

    if (updateData.orderStatus === "cancelled") {
      updateData.paymentStatus = "refunded";
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return failResp(res, 404, "Order not found1", "ORDER_NOT_FOUND");
    }

    // Revert item quantity if order is cancelled
    if (
      updateData.orderStatus === "cancelled" &&
      existingOrder.orderStatus !== "cancelled"
    ) {
      const bulkUpdates = existingOrder.items.map((item) => ({
        updateOne: {
          filter: { _id: item.item },
          update: { $inc: { quantity: item.quantity || 1 } },
        },
      }));

      await Item.bulkWrite(bulkUpdates);
    }

    await logDbTransaction(
      "UPDATE",
      "Order",
      orderId,
      req.tokenUserData?.id,
      "Order updated"
    );

    return successResp(
      res,
      200,
      { order: updatedOrder },
      "Order updated successfully"
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return failResp(res, 500, "Failed to update order", "ORDER_UPDATE_FAILED");
  }
};
