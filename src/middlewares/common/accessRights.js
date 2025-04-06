const { failResp } = require("../../utils/index");
const { errorData } = require("../../utils/errorCodes");
const LIST = require("../../config/accessRights");

const accessRights = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.tokenUserData?.role ?? "user"; // Assuming user role is stored in req.tokenUserData

    if (!allowedRoles.includes(userRole)) {
      const errData = errorData["ACCESS_DENIED"];
      return failResp(res, errData.status, errData.message, errData.code);
    }

    next();
  };
};

module.exports = {
  accessRights,
  LIST,
};

// Example usage in a route
// const express = require('express');
// const router = express.Router();
// const accessRights = require('./path/to/accessRights');
// const { createCategory } = require('./path/to/controller');
//
// router.post('/create-category', accessRights(['admin', 'editor']), createCategory);
// module.exports = router;
// module.exports = accessRights;
// Example usage in a route
