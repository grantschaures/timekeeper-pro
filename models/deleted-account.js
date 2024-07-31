const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require("../db");

// Note schema
const DeletedAccount = db.model("DeletedAccount", {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  deletionDate: { type: Date, required: true }
}, 'Deleted-Accounts');

module.exports = DeletedAccount;