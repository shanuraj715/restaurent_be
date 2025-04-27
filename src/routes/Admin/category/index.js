const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../../../controllers/Admin/category/index");
const { checkPermission, PERMISSIONS } = require("../../../middlewares/common/accessControl");

const router = express.Router();

// Create category - only admin
router.post("/create", checkPermission(PERMISSIONS.CATEGORY.CREATE), createCategory);

// Update category - only admin
router.put("/update/:id", checkPermission(PERMISSIONS.CATEGORY.UPDATE), updateCategory);

// Delete category - only admin
router.delete("/delete/:id", checkPermission(PERMISSIONS.CATEGORY.DELETE), deleteCategory);

// Get all categories - admin and user
router.get("/list", checkPermission(PERMISSIONS.CATEGORY.READ), getAllCategories);

module.exports = router;
