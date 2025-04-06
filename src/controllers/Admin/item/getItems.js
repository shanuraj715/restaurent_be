const Item = require("../../../models/Admin/Item/Item");
const Category = require("../../../models/Admin/Category/Category");
const { successResp, failResp, isValidObjectId } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

// Get Items with filters and populate categories
exports.getItems = async (req, res) => {
  try {
    const { isVeg, categoryIds, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (isVeg === "true") filter.isVeg = true;
    else if (isVeg === "false") filter.isVeg = false;

    const activeCategories = await Category.find({ isActive: true }).select(
      "_id"
    );
    const activeCategoryIds = activeCategories.map((cat) => cat._id.toString());

    if (categoryIds) {
      const requestedCategoryIds = categoryIds
        .split(",")
        .filter((id) => isValidObjectId(id))
        .map((id) => id.trim());
      const validCategoryIds = requestedCategoryIds.filter((id) =>
        activeCategoryIds.includes(id)
      );
      filter.categories = { $in: validCategoryIds };
    } else {
      filter.categories = { $in: activeCategoryIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, totalCount] = await Promise.all([
      Item.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate({
          path: "categories",
          model: "Category",
          match: { isActive: true },
          select: "categoryName description images",
        }),
      Item.countDocuments(filter),
    ]);

    return successResp(
      res,
      200,
      {
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit),
        },
        items,
      },
      "Items fetched successfully"
    );
  } catch (err) {
    console.error("Error fetching items:", err);
    return failResp(res, 500, "Internal Server Error", "INTERNAL_SERVER_ERROR");
  }
};
