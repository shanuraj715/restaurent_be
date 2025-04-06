const mongoose = require("mongoose");
const Order = require("../../../models/Admin/Order/Order");
const { successResp, failResp, isValidObjectId } = require("../../../utils");

exports.fetchOrders = async (req, res) => {
  try {
    const {
      customerId,
      createdBy,
      orderDate,
      orderStatus,
      paymentStatus,
      orderType,
      page = 1,
      limit = 10,
    } = req.query;

    const sort = req.query.sort === "asc" ? 1 : -1;

    const orConditions = [];

    if (isValidObjectId(customerId)) {
      orConditions.push({ customerId });
    }

    if (isValidObjectId(createdBy)) {
      orConditions.push({ createdBy });
    }

    if (orderDate) {
      const date = new Date(orderDate);
      if (!isNaN(date)) {
        orConditions.push({
          createdAt: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lte: new Date(date.setHours(23, 59, 59, 999)),
          },
        });
      }
    }

    if (orderStatus) {
      orConditions.push({ orderStatus });
    }

    if (paymentStatus) {
      orConditions.push({ paymentStatus });
    }

    if (orderType) {
      orConditions.push({ orderType });
    }

    const filter = orConditions.length > 0 ? { $or: orConditions } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: sort }),
      Order.countDocuments(filter),
    ]);

    return successResp(
      res,
      200,
      {
        orders,
        pagination: {
          total: totalOrders,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalOrders / limit),
        },
      },
      "Orders fetched successfully"
    );
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return failResp(res, 500, "Failed to fetch orders", "ORDER_FETCH_FAILED");
  }
};
