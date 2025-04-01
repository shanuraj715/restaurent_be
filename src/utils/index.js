const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");

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

const successResp = (res, statusCode, data, message, callback) => {
  let _message = message;
  if (typeof message !== "string") {
    // throw new Error("Message must be a string");
    _message = "";
  }
  callback?.();
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
};
