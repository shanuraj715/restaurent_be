const {
  successResp,
  failResp,
  stripBasePathFromImages,
} = require("../../utils");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir_temp = process.env.UPLOADS_TEMP_PATH;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

if (!fs.existsSync(uploadDir_temp)) {
  fs.mkdirSync(uploadDir_temp, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir_temp),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: MAX_FILE_SIZE,
    files: 1 // Limit to single file upload
  },
}).single("image");

const mediaData = (req) => ({
  originalFileName: req.file.originalname,
  uploadedFilePath: req.file.path,
  uploadedBy: req.tokenUserData?.id,
  role: req.tokenUserData?.role || "customer",
  kind: "image",
});

exports.uploadImage = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      let errorMessage = "File upload failed";
      let errorCode = "UPLOAD_ERROR";

      if (err.code === 'LIMIT_FILE_SIZE') {
        errorMessage = `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        errorCode = "FILE_SIZE_EXCEEDED";
      } else if (err.message.includes('Invalid file type')) {
        errorMessage = err.message;
        errorCode = "INVALID_FILE_TYPE";
      }

      return failResp(res, 400, errorMessage, errorCode);
    }

    if (!req.file) {
      return failResp(res, 400, "No file was uploaded", "NO_FILE_UPLOADED");
    }

    const obj = mediaData(req);
    req.media = {
      ...req.media,
      ...obj,
    };

    next();
  });
};
