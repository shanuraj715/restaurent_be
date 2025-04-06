const Category = require("../../../models/Admin/Category/Category");
const { failResp, successResp, logDbTransaction } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log(categoryId);

    // Check if categoryId is provided
    if (!categoryId) {
      const errData = errorData["INVALID_INPUT"];
      return failResp(res, 400, "Category ID is mandatory.", errData.code);
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    console.log(category);
    if (!category) {
      const errData = errorData["CATEGORY_NOT_FOUND"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Delete the category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      const errData = errorData["DB_DELETE_ERROR"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Log the deletion
    await logDbTransaction(
      "DELETE",
      "Category",
      categoryId,
      req.tokenUserData.id,
      `Category ${category.categoryName} deleted successfully`
    );

    return successResp(res, 200, "Category deleted successfully", {
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return failResp(res, 500, "Internal server error", "INTERNAL_SERVER_ERROR");
  }
};
