const mongoose = require("mongoose");
const { VALID_MEDIA_TYPES } = require("../../constants");

const MediaSrcSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true, // physical path on disk
  },
  src: {
    type: String,
    required: true, // public URL
  },
  size: {
    type: String,
    enum: ["small", "medium", "large", "original", "default"],
    default: "original",
  },
  sizeInBytes: {
    type: Number,
    default: null,
  },
  extension: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: null,
  },
  height: {
    type: Number,
    default: null,
  },
});

const MediaUploadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: VALID_MEDIA_TYPES,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser", // or Customer/User depending on your structure
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      required: true,
    },
    kind: {
      type: String,
      enum: ["image", "video", "audio", "document"],
      required: true,
    },
    originalName: {
      type: String,
      default: "",
    },
    extension: {
      type: String,
      default: "",
    },
    sizeInBytes: {
      type: Number,
      default: null,
    },
    defaultSource: {
      type: String,
      default: null,
    },
    src: {
      type: [MediaSrcSchema], // includes small/medium/large versions if image
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaUpload", MediaUploadSchema);
