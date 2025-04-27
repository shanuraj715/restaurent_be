const express = require("express");

const { uploadImage } = require("../../../middlewares/common/imageUpload");
const { verifyToken } = require("../../../middlewares/jwt");

const { processImage } = require("../../../middlewares/common/processImage");
const {
  createMediaUpload,
  updateMediaUpload,
  deleteMediaUpload,
} = require("../../../controllers/common/saveMediaUploadInfoToDB");

const { saveprofilePicInDB } = require("../../../controllers/User/media/saveProfilePicInDB");

const { getMediaList } = require("../../../controllers/Admin/media/getMediaList");

const router = express.Router();

const addUploadTypeOnReq = (type) => (req, res, next) => {
  const _type = type;
  req.media = {
    type: _type,
    ...req.media,
  };
  next();
};

router.use(verifyToken);

router.get('/list', getMediaList)

router.post(
  "/profileImage",
  addUploadTypeOnReq("profilePic"),
  uploadImage, // to temp directory
  processImage("profilePic"),
  saveprofilePicInDB
);

router.post(
  "/itemImage",
  addUploadTypeOnReq("itemImage"),
  uploadImage, // to temp directory
  processImage("itemImage"),
  createMediaUpload
);

module.exports = router;
