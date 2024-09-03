const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require("../db");

// Note schema
const NotesEntry = db.model("NotesEntry", {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    entry: {
        id: { type: String },
        classList: { type: [String] },
        content: { type: String },
        date: { type: Date, default: Date.now },
        completionDate: { type: Date }
    }
}, 'Notes');

module.exports = NotesEntry;