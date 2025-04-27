const mongoose = require("mongoose");

const WebsiteSettingsSchema = new mongoose.Schema(
  {
    settings: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one document exists
WebsiteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      settings: {},
      lastUpdatedBy: null, // This will be updated when settings are saved
    });
  }
  return settings;
};

module.exports = mongoose.model("WebsiteSettings", WebsiteSettingsSchema); 