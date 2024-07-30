const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require("../db");

// Note schema
const Login = db.model("Login", {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  loginDate: { type: Date, required: true },
  userAgent: { type: String, required: true },
  userDevice: { type: String, required: true },
  loginMethod: { type: String, required: true }
}, 'Logins');

module.exports = Login;