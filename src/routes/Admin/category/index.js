const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../../../controllers/Admin/category/index");
const {
  accessRights,
  LIST,
} = require("../../../middlewares/common/accessRights");

const router = express.Router();

router.post("/create", accessRights(LIST.CREATE_CATEGORY), createCategory);
router.delete("/delete", accessRights(LIST.DELETE_CATEGORY), deleteCategory);
router.post("/update", accessRights(LIST.UPDATE_CATEGORY), updateCategory);
router.get("/list", accessRights(LIST.GET_ALL_CATEGORIES), getAllCategories);

module.exports = router;
