require("./config/global");
const path = require("path");
const fs = require("fs");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3030;

const imagePaths = [
  process.env.UPLOADS_TEMP_PATH,
  process.env.PROFILE_PIC_PATH,
  process.env.ITEM_IMAGE_PATH,
  process.env.APP_IMAGES_PATH,
];

imagePaths.forEach((dir) => {
  // const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
