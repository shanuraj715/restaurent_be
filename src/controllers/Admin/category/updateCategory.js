const Category = require("../../../models/Admin/Category/Category");
const { failResp, successResp, logDbTransaction } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

exports.updateCategory = async (req, res) => {
  try {
    const {
      categoryId,
      categoryName,
      description,
      images,
      isActive = false,
    } = req.body;

    // Validate all mandatory fields
    if (
      !categoryId ||
      !categoryName ||
      !description ||
      !Array.isArray(images)
    ) {
      const errData = errorData["INVALID_INPUT"];
      return failResp(
        res,
        400,
        "Category ID, name, description, and images array are all mandatory.",
        errData.code
      );
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      const errData = errorData["CATEGORY_NOT_FOUND"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Optional: Check if category name already exists for another category
    const duplicate = await Category.findOne({
      categoryName,
      _id: { $ne: categoryId },
    });
    if (duplicate) {
      const errData = errorData["CATEGORY_ALREADY_EXISTS"];
      return failResp(
        res,
        errData.status,
        "Category name already exists.",
        errData.code
      );
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        $set: {
          categoryName,
          description,
          images,
          isActive,
        },
      },
      { new: true }
    );

    if (!updatedCategory) {
      const errData = errorData["DB_UPDATE_ERROR"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Log the update
    await logDbTransaction(
      "UPDATE",
      "Category",
      categoryId,
      req.tokenUserData.id,
      `Category ${categoryName} updated successfully`
    );

    return successResp(res, 200, "Category updated successfully", {
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return failResp(res, 500, "Internal server error", "INTERNAL_SERVER_ERROR");
  }
};
