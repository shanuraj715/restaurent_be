const Item = require("../../../models/Admin/Item/Item");
const Category = require("../../../models/Admin/Category/Category");
const { successResp, failResp, logDbTransaction } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

// Update Item
exports.updateItem = async (req, res) => {
  try {
    const {
      itemId,
      itemName,
      description,
      price,
      currencyCode,
      quantity,
      categories,
      isVeg,
      images,
    } = req.body;

    if (
      !itemId ||
      !itemName ||
      !price ||
      !quantity ||
      !Array.isArray(categories)
    ) {
      const errData = errorData["INVALID_INPUT"];
      return failResp(res, 400, "Missing required fields", errData.code);
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        itemName,
        description,
        price,
        currencyCode,
        quantity,
        categories,
        isVeg,
        images,
      },
      { new: true }
    );

    if (!updatedItem) {
      const errData =
        errorData["ITEM_NOT_FOUND"] || errorData["DB_WRITE_ERROR"];
      return failResp(
        res,
        errData.status || 404,
        errData.message || "Item not found",
        errData.code || "ITEM_NOT_FOUND"
      );
    }

    await logDbTransaction(
      "UPDATE",
      "Item",
      itemId,
      req.tokenUserData.id,
      `Item ${itemName} updated`
    );

    return successResp(
      res,
      200,
      { item: updatedItem },
      "Item updated successfully"
    );
  } catch (err) {
    console.error("Error updating item:", err);
    return failResp(res, 500, "Internal Server Error", "INTERNAL_SERVER_ERROR");
  }
};
