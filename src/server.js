require("./config/global");
const path = require("path");
const fs = require("fs");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3030;

const imagePaths = [
  "assets/images/items",
  "assets/images/users",
  "assets/images/app",
];

imagePaths.forEach((dir) => {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
