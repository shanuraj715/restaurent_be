const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const AuditLog = require("../models/Admin/AuditLog/AuditLog");
const mongoose = require("mongoose");

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
  description
) => {
  const data = {
    action,
    collectionName,
    documentId,
    performedBy,
    description,
  };
  try {
    await AuditLog.create(data);
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
};
