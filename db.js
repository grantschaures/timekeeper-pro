const mongoose = require("mongoose");

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB: ", error);
});

module.exports = mongoose;