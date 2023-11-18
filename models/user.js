const db = require("../db");

// Create a Song model from the schema
const User = db.model("User", {
  email:    { type: String, required: true },
  password: { type: String, required: true }
}, 'Users');

module.exports = User;