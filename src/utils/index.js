const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const AuditLog = require("../models/Admin/AuditLog/AuditLog");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Verifies a password against a hashed password.
 * @param {string} password - The password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const generateOTP = (length = 6) => {
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

const ALGORITHM = "aes-256-cbc"; // AES encryption algorithm
const SECRET_KEY = Buffer.from(process.env.CRYPTO_SECRET_KEY, "base64"); // Generate a 32-byte random key
const IV = Buffer.from(process.env.CRYPTO_IV, "base64"); // Generate a 16-byte initialization vector

/**
 * Encrypt a string or object
 * @param {string|object} data - Data to encrypt
 * @returns {string} - Encrypted string in base64 format
 */
function encrypt(data) {
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  let encrypted = cipher.update(JSON.stringify(data), "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
  let decrypted = decipher.update(encryptedData, "base64", "utf-8");
  decrypted += decipher.final("utf-8");
  return JSON.parse(decrypted);
}

const successResponseObject = (msg, data, statusCode) => {
  return {
    status: true,
    message: msg,
    data,
    statusCode,
  };
};

const failResponseObject = (message, errorCode, data, statusCode) => {
  return {
    status: false,
    message,
    data,
    errorCode,
    statusCode,
  };
};

const successResp = (res, statusCode, data, message, options) => {
  const { callback, cookies = [] } = options || {};
  let _message = typeof message === "string" ? message : "";

  callback?.();

  // Set multiple cookies if cookies is an array
  if (Array.isArray(cookies)) {
    cookies.forEach(({ name, value, options = {} }) => {
      if (name && value) {
        const defaultOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          ...options,
        };
        res.cookie(name, value, defaultOptions);
      }
    });
  }

  return res
    .status(statusCode)
    .json(successResponseObject(_message, data, statusCode));
};

const failResp = (
  res,
  statusCode,
  message,
  errorCode,
  data = null,
  callback
) => {
  let _message = message;
  if (typeof message !== "string") {
    // throw new Error("Message must be a string");
    _message = "";
  }
  callback?.();
  return res
    .status(statusCode)
    .json(failResponseObject(_message, errorCode, data, statusCode));
};

const logDbTransaction = async (
  action,
  collectionName,
  documentId,
  performedBy,
  description,
  data
) => {
  const dataForDB = {
    action,
    collectionName,
    documentId,
    performedBy,
    description,
    data,
  };
  try {
    await AuditLog.create(dataForDB);
  } catch (error) {
    console.error("Failed to log DB transaction", error);
  }
};

const sendOtpViaSMS = async (mobileNumber, countryCode = "+91") => {
  const otp = generateOTP();
  // TODO: Implement your SMS sending logic here
  console.log("Sending OTP via SMS", otp);
  return otp;
};

const sendOtpViaEmail = async (emailAddress) => {
  const otp = generateOTP();
  // TODO: Implement your email sending logic here
  console.log("Sending OTP via Email", otp);
  return otp;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Deletes a file from disk.
 * @param {string} filePath - Absolute path of the file to delete
 */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      // console.log(`Deleted file: ${filePath}`);
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  }
};

/**
 * Removes the base project path from image file paths.
 * @param {Array} images - Array of image objects with a `path` property.
 * @param {string} basePath - The base path to remove.
 * @returns {Array} updated image array
 */
const stripBasePathFromImages = (
  imagePath,
  basePath = process.env.ASSETS_BASE_PATH || ""
) => {
  return path.relative(basePath, imagePath).replace(/\\/g, "/");
};

const getUrlFromImagePath = (imagePath) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000/";
  return `${baseUrl}${process.env.ASSETS_DIRECTORY_NAME}/${imagePath}`;
};

/**
 * Parses a Mongoose validation error and returns a standardized response object.
 * @param {Object} error - Mongoose ValidationError instance
 * @returns {Object} { code, message, fields }
 */
const parseMongooseValidationError = (error) => {
  if (!error || error.name !== "ValidationError") {
    return {
      code: "UNKNOWN_VALIDATION_ERROR",
      message: "An unknown validation error occurred.",
      fields: {},
    };
  }

  const fields = {};

  for (const [field, err] of Object.entries(error.errors)) {
    fields[field] = err.message;
  }

  return {
    code: "VALIDATION_ERROR",
    message: "Validation failed for one or more fields.",
    fields, // e.g., { 'src.0.size': "`default` is not a valid enum value for path `size`." }
  };
};

module.exports = {
  decrypt,
  encrypt,
  failResp,
  failResponseObject,
  generateOTP,
  hashPassword,
  successResp,
  successResponseObject,
  verifyPassword,
  logDbTransaction,
  sendOtpViaSMS,
  sendOtpViaEmail,
  isValidObjectId,
  deleteFile,
  stripBasePathFromImages,
  getUrlFromImagePath,
  parseMongooseValidationError
};
