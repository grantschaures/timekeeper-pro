const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require("../db");

// Note schema
const Note = db.model("Note", {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  labels: {
    type: Map,
    of: String,
    default: {}
  },
  lastLabelIdNum: { type: Number, default: 3 },
  lastSelectedEmojiId: { type: String, default: "books-emoji" },
  noteTasks: [
    {
      id: { type: String },
      classList: { type: [String] },
      content: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],
  lastTaskInputIdNum: { type: Number, default: 0 }
}, 'Notes');

module.exports = Note;