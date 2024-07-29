const db = require("../db");
const mongoose = require('mongoose');
const { sessionSchema } = require('./session');
const Schema = mongoose.Schema;

// Define the Report schema
const reportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    sessionCount: { type: Number },
    lastSession: sessionSchema
}, { collection: 'Reports' });

// Create the Report model
const Report = db.model("Report", reportSchema);

module.exports = Report;