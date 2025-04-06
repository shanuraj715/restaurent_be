const Category = require("../../../models/Admin/Category/Category");
const { failResp, successResp, logDbTransaction } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

exports.createCategory = async (req, res) => {
  try {
    const { categoryName, description, isActive = false } = req.body;

    // check if categoryName and description is sent
    if (!categoryName || !description) {
      const errData = errorData["INVALID_INPUT"];
      return failResp(
        res,
        400,
        "Category name and description is mandatory.",
        errData.code
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      const errData = errorData["CATEGORY_ALREADY_EXISTS"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Create new category
    const newCategory = new Category({
      categoryName,
      description,
      createdBy: req.tokenUserData.id,
      isActive,
    });

    // save in DB and check if saved
    const savedCategory = await newCategory.save();
    if (!savedCategory) {
      const errData = errorData["DB_WRITE_ERROR"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    // Log category creation into database
    await logDbTransaction(
      "CREATE",
      "Category",
      savedCategory._id,
      req.tokenUserData.id,
      `Category ${categoryName} created successfully`
    );
    return successResp(res, 201, "Category created successfully", {
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return failResp(res, 500, "Internal server error", "INTERNAL_SERVER_ERROR");
  }
};
