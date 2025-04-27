const WebsiteSettings = require("../../models/Admin/WebsiteSettings");
const { successResp, failResp } = require("../../utils");
const { errorData } = require("../../utils/errorCodes");

// Get website settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    
    // Create a user context for LaunchDarkly
    const user = {
      key: req.tokenUserData?._id?.toString() || 'anonymous',
      name: req.tokenUserData?.name || 'Anonymous User',
      custom: {
        role: req.tokenUserData?.role || 'anonymous',
      }
    };

    // Get all feature flags for the user
    const flags = {};
    for (const [key, flagKey] of Object.entries(FEATURE_FLAGS)) {
      flags[key] = await getFeatureFlag(flagKey, user);
    }

    // Combine settings with feature flags
    const response = {
      ...settings.settings,
      featureFlags: flags
    };

    return successResp(res, 200, response, "Settings retrieved successfully");
  } catch (error) {
    console.error("Error getting settings:", error);
    const _errorData = errorData["SERVER_ERROR"];
    return failResp(res, _errorData.status, _errorData.message, _errorData.code);
  }
};

// Update website settings
exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.tokenUserData._id; // Get user ID from token

    if (!settings || typeof settings !== "object") {
      const _errorData = errorData["INVALID_REQUEST"];
      return failResp(res, _errorData.status, "Invalid settings data", _errorData.code);
    }

    const websiteSettings = await WebsiteSettings.getSettings();
    websiteSettings.settings = settings;
    websiteSettings.lastUpdatedBy = userId;
    
    await websiteSettings.save();

    return successResp(res, 200, websiteSettings.settings, "Settings updated successfully");
  } catch (error) {
    console.error("Error updating settings:", error);
    const _errorData = errorData["SERVER_ERROR"];
    return failResp(res, _errorData.status, _errorData.message, _errorData.code);
  }
}; 