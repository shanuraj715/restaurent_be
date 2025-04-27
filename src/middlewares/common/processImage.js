const { resizeAndSave } = require("../../utils/imageProcessor");
const path = require("path");
const { deleteFile } = require("../../utils");
const crypto = require("crypto");
const fs = require("fs");

const mediaData = (src) => ({
  src,
  isActive: true,
});

exports.processImage = (type) => {
  if (type === "profilePic") {
    return async (req, res, next) => {
      // Process the image here
      const { uploadedFilePath, originalFileName } = req.media;
      // console.log(uploadedFilePath, originalFileName)
      const destination = process.env.PROFILE_PIC_PATH;
      const sizes = [{ name: "small", width: 80, height: 80, quality: 80 }];
      const fileName =
        (req.tokenUserData?.id || originalFileName) + "_profilePic_";
      const processedFiles = await resizeAndSave(
        uploadedFilePath,
        destination,
        sizes,
        fileName
      );
      req.media = {
        ...req.media,
        ...mediaData(processedFiles),
      };
      deleteFile(uploadedFilePath);
      next();
    };
  }
  if (type === "itemImage") {
    return async (req, res, next) => {
      const { uploadedFilePath, originalFileName } = req.media;
      const hash = crypto
        .createHash("md5")
        .update(originalFileName + Date.now())
        .digest("hex");

      const subfolder = hash.slice(0, 2); // 2-char subdirectory
      const destination = path.join(process.env.ITEM_IMAGE_PATH, subfolder);

      // ensure subdirectory exists
      fs.mkdirSync(destination, { recursive: true });

      const defaultImageSize = {
        width: 150,
        height: 150,
        quality: 90,
        name: 'default'
      }

      const sizes = [
        defaultImageSize,
        { name: "small", width: 200, height: 200, quality: 90 },
        { name: "medium", width: 320, height: 320, quality: 90 },
        { name: "large", width: 500, height: 500, quality: 90 },
      ];
      const fileName = `${hash}`;
      const start = Date.now();
      const processedFiles = await resizeAndSave(
        uploadedFilePath,
        destination,
        sizes,
        fileName
      );
      const end = Date.now();
      // console.log(
      //   "Processing time:",
      //   end - start,
      //   "ms",
      //   (end - start) / 1000,
      //   "s"
      // );
      req.media = {
        ...req.media,
        ...mediaData(processedFiles),
        processingTime: end - start,
      };
      deleteFile(uploadedFilePath);
      next();
    };
  }
};
