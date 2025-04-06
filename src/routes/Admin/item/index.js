const express = require("express");
const {
  createItem,
  updateItem,
  deleteItem,
  getItems,
} = require("../../../controllers/Admin/item/index");
const {
  accessRights,
  LIST,
} = require("../../../middlewares/common/accessRights");

const { verifyToken } = require("../../../middlewares/Admin/jwt/adminUser");

const router = express.Router();
router.get("/list", accessRights(LIST.GET_ALL_CATEGORIES), getItems);

// now add the middleware to only add, update, delete from admin dashboard using token.
router.use(verifyToken);

router.post("/add", accessRights(LIST.CREATE_CATEGORY), createItem);
router.delete("/delete", accessRights(LIST.DELETE_CATEGORY), deleteItem);
router.post("/update", accessRights(LIST.UPDATE_CATEGORY), updateItem);

module.exports = router;
