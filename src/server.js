require("./config/global");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3030;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
