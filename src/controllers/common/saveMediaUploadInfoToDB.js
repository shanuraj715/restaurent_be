const MediaUpload = require("../../models/common/MediaUpload");
const {
  successResp,
  failResp,
  logDbTransaction,
  getUrlFromImagePath,
  parseMongooseValidationError,
} = require("../../utils");

// Create media upload document
exports.createMediaUpload = async (req, res) => {
  try {
    const { media } = req;
    // console.log(media)
    const {
      type,
      originalFileName,
      uploadedFilePath,
      uploadedBy,
      role,
      kind,
      src, // src
      isActive,
      processingTime,
    } = media;

    const [getDefaultImage] = src;
    src.shift(); // remove default image from src array

    const object = {
      type,
      sizeInBytes: getDefaultImage.sizeInBytes,
      defaultSource: getDefaultImage.src,
      extension: getDefaultImage.extension,
      originalFileName,
      uploadedFilePath,
      uploadedBy,
      role,
      kind,
      src,
      isActive,
    };

    const newMedia = new MediaUpload(object);
    const saved = await newMedia.save();

    await logDbTransaction(
      "CREATE",
      "MediaUpload",
      saved._id,
      req.tokenUserData?.id,
      "Media uploaded",
      {
        processingTime,
      }
    );

    const responseData = {
      uploadedBy: saved.uploadedBy,
      role: saved.role,
      kind: saved.kind,
      src: saved.src?.map((item) => ({
        src: getUrlFromImagePath(item.src),
        size: item.size,
        sizeInKB: Math.ceil(item.sizeInBytes / 1024),
        // path: "",
        extension: item.extension,
        width: item.width,
        height: item.height,
        _id: item._id,
      })),
      isActive: saved.isActive,
      originalFileName: saved.originalName,
      type: saved.type,
      _id: saved._id,
    };

    return successResp(
      res,
      201,
      { media: responseData },
      "Media uploaded successfully"
    );
  } catch (error) {
    console.error("Media upload failed:", parseMongooseValidationError(error));
    return failResp(res, 500, "Failed to save media", "MEDIA_SAVE_FAILED");
  }
};

// Update media upload document
exports.updateMediaUpload = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const updates = req.body;

    const updated = await MediaUpload.findByIdAndUpdate(mediaId, updates, {
      new: true,
    });

    if (!updated) {
      return failResp(res, 404, "Media not found", "MEDIA_NOT_FOUND");
    }

    await logDbTransaction(
      "UPDATE",
      "MediaUpload",
      mediaId,
      req.tokenUserData?.id,
      "Media updated"
    );

    return successResp(
      res,
      200,
      { media: updated },
      "Media updated successfully"
    );
  } catch (error) {
    console.error("Media update failed:", error);
    return failResp(res, 500, "Failed to update media", "MEDIA_UPDATE_FAILED");
  }
};

// Delete media upload document
exports.deleteMediaUpload = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const deleted = await MediaUpload.findByIdAndDelete(mediaId);

    if (!deleted) {
      return failResp(res, 404, "Media not found", "MEDIA_NOT_FOUND");
    }

    await logDbTransaction(
      "DELETE",
      "MediaUpload",
      mediaId,
      req.tokenUserData?.id,
      "Media deleted"
    );

    return successResp(
      res,
      200,
      { media: deleted },
      "Media deleted successfully"
    );
  } catch (error) {
    console.error("Media delete failed:", error);
    return failResp(res, 500, "Failed to delete media", "MEDIA_DELETE_FAILED");
  }
};
