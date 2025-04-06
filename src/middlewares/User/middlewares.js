const { failResp } = require("../../utils/index");
const validator = require("validator");

const validateRegistrationFields = (req, res, next) => {
  const { firstName, email, password, mobileNumber } = req.body;

  // saperate all check
  if (!firstName || firstName.length < 2 || firstName.length > 50) {
    return failResp(
      res,
      400,
      "First name must be between 2 and 50 characters.",
      "INVALID_FIRST_NAME"
    );
  }
  //   if (!lastName || lastName.length < 2 || lastName.length > 50) {
  //     return failResp(
  //       res,
  //       400,
  //       "Last name must be between 2 and 50 characters.",
  //       "INVALID_LAST_NAME"
  //     );
  //   }
  if (!email || !validator.isEmail(email)) {
    return failResp(res, 400, "Invalid email format.", "INVALID_EMAIL");
  }
  if (!password || password.length < 8) {
    return failResp(
      res,
      400,
      "Password must be at least 8 characters long.",
      "INVALID_PASSWORD"
    );
  }
  if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
    return failResp(res, 400, "Invalid mobile number.", "INVALID_MOBILE");
  }
  next();
};

const validateLoginFields = async (req, res, next) => {
  const { mobileNumber, password } = req.body;

  if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
    return failResp(res, 400, "Invalid mobile number.", "INVALID_MOBILE");
  }
  if (!password || password.length < 8) {
    return failResp(
      res,
      400,
      "Password must be at least 8 characters long.",
      "INVALID_PASSWORD"
    );
  }
  next();
};

module.exports = {
  validateRegistrationFields,
  validateLoginFields,
};
