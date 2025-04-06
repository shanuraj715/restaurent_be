const Category = require("../../../models/Admin/Category/Category");
const { failResp, successResp } = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");

const adminPopulate = "name email mobile role";
const userPopulate = "";

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "createdBy",
        select:
          req.tokenUserData.role === "admin" ? adminPopulate : userPopulate, // only select needed fields
      })
      .sort({ createdAt: -1 });

    // if (!categories || categories.length === 0) {
    //   const errData = errorData["NO_CATEGORIES_FOUND"] || {
    //     status: 404,
    //     message: "No categories found.",
    //     code: "NO_CATEGORIES_FOUND",
    //   };
    //   return failResp(res, errData.status, errData.message, errData.code);
    // }

    return successResp(res, 200, categories, "Categories fetched successfully");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return failResp(res, 500, "Internal server error", "INTERNAL_SERVER_ERROR");
  }
};
