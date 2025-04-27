const CustomerAccountModel = require("../../../models/User/User");
const bcrypt = require("bcryptjs");
const { failResp, successResp, logDbTransaction } = require("../../../utils");
const { generateToken } = require("../../../middlewares/jwt");

exports.login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return failResp(
        res,
        400,
        "Mobile number and password are required.",
        "FIELDS_MISSING"
      );
    }

    const customer = await CustomerAccountModel.findOne({ mobileNumber });

    if (!customer) {
      return failResp(res, 404, "Customer not found.", "CUSTOMER_NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return failResp(res, 401, "Incorrect password.", "INVALID_PASSWORD");
    }

    // ✅ Generate JWT using your middleware
    const token = generateToken({
      _id: customer._id,
      email: customer.email,
      role: "CUSTOMER",
      name: `${customer.firstName} ${customer.lastName}`,
    });

    // ✅ Save token to DB
    customer.tokens.push({
      token,
      isExpired: false,
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await customer.save();

    await logDbTransaction(
      "LOGIN",
      "CustomerAccount",
      customer._id,
      customer._id,
      `Customer ${customer.firstName} ${customer.lastName} logged in`
    );

    return successResp(
      res,
      200,
      {
        token,
        customer: {
          id: customer._id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          mobileNumber: customer.mobileNumber,
        },
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login Error:", error);
    return failResp(res, 500, "Internal server error.", "SERVER_ERROR");
  }
};
