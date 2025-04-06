const Customer = require("../../../models/User/User");
const {
  failResp,
  successResp,
  logDbTransaction,
  hashPassword,
} = require("../../../utils");
const { errorData } = require("../../../utils/errorCodes");
const { sendOtpViaSMS } = require("../../../utils");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNumber } = req.body;

    // Check for existing user
    const existing = await Customer.findOne({
      $or: [{ email }, { mobileNumber }],
    });
    if (existing) {
      const errData = errorData["USER_ALREADY_EXISTS"];
      return failResp(
        res,
        409,
        "Mobile or Email already exists.",
        errData.code,
        {
          isActive: existing.isActive,
          isBlocked: existing.isBlocked,
        }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const otp = await sendOtpViaSMS(mobileNumber);
    if (!otp) {
      return failResp(
        res,
        500,
        "Failed to send OTP. Please try again.",
        "OTP_SENDING_FAILED"
      );
    }

    // Create new customer
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
      otps: {
        otp,
        createdAt: Date.now(),
        isUsed: false,
      },
    });

    const savedCustomer = await newCustomer.save();

    await logDbTransaction(
      "CREATE",
      "CustomerAccount",
      savedCustomer._id,
      null,
      `Customer ${savedCustomer.firstName} registered successfully`
    );

    const response = {
      customer: {
        firstName: savedCustomer.firstName,
        lastName: savedCustomer.lastName ?? "",
        email: savedCustomer.email,
        mobileNumber: savedCustomer.mobileNumber,
        createdAt: savedCustomer.createdAt,
      },
      otpStatus: !!otp,
    };

    return successResp(
      res,
      201,
      { customer: response },
      "Customer registered successfully"
    );
  } catch (error) {
    console.error("Registration error:", error);
    return failResp(res, 500, "Internal Server Error", "INTERNAL_SERVER_ERROR");
  }
};
