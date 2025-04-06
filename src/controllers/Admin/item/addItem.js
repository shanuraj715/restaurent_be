const Item = require("../../../models/Admin/Item/Item");
const Category = require("../../../models/Admin/Category/Category");
const {
  successResp,
  failResp,
  logDbTransaction,
  isValidObjectId,
} = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

// Create Item
exports.createItem = async (req, res) => {
  try {
    const {
      itemName,
      description,
      price,
      currencyCode,
      quantity,
      categories,
      isVeg,
      images,
    } = req.body;

    // check if category is present. If yes then convert it to array
    // if (categories && !Array.isArray(categories)) {
    //   categories = [categories];
    // }

    // Basic validations
    if (!itemName || !price || !quantity || !categories) {
      const errData = errorData["INVALID_INPUT"];
      console.log(req.body);
      return failResp(res, 400, "Missing required fields", errData.code);
    }

    // check if string is type of mongoose objectId
    const validCategories = categories
      ?.split(",")
      .filter((category) => isValidObjectId(category));

    const newItem = new Item({
      itemName,
      description,
      price,
      currencyCode,
      quantity,
      categories: validCategories,
      isVeg,
      images,
    });

    const savedItem = await newItem.save();

    if (!savedItem) {
      const errData = errorData["DB_WRITE_ERROR"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    await logDbTransaction(
      "CREATE",
      "Item",
      savedItem._id,
      req.tokenUserData.id,
      `Item ${itemName} created`
    );

    return successResp(
      res,
      201,
      { item: savedItem },
      "Item created successfully"
    );
  } catch (err) {
    console.error("Error creating item:", err);
    return failResp(res, 500, "Internal Server Error", "INTERNAL_SERVER_ERROR");
  }
};
