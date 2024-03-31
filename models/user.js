const db = require("../db");

// User model from the schema
const User = db.model("User", {
  email:    { type: String, required: true },
  password: { type: String, required: false },
  // Adding temporary secure token and its expiration
  token: { type: String, required: false },
  tokenExpire: { type: Date, required: false },
  emailVerified: { type: Boolean, required: true},
  logins: { type: Number, required: true, default: 0 },
}, 'Users');

module.exports = User;