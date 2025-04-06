const Item = require("../../../models/Admin/Item/Item");
const Category = require("../../../models/Admin/Category/Category");
const { successResp, failResp, logDbTransaction } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

// Delete Item
exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      const errData = errorData["INVALID_INPUT"];
      return failResp(res, 400, "Item ID is required", errData.code);
    }

    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      const errData =
        errorData["ITEM_NOT_FOUND"] || errorData["DB_DELETE_ERROR"];
      return failResp(
        res,
        errData.status || 404,
        errData.message || "Item not found",
        errData.code || "ITEM_NOT_FOUND"
      );
    }

    await logDbTransaction(
      "DELETE",
      "Item",
      itemId,
      req.tokenUserData.id,
      `Item ${deletedItem.itemName} deleted`
    );

    return successResp(
      res,
      200,
      { item: deletedItem },
      "Item deleted successfully"
    );
  } catch (err) {
    console.error("Error deleting item:", err);
    return failResp(res, 500, "Internal Server Error", "INTERNAL_SERVER_ERROR");
  }
};
