const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require("../db");

// Note schema
const Note = db.model("Note", {
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  labels: {
    type: Map,
    of: String,
    default: {}
  },
  selectedLabels: {
    type: Map,
    of: String,
    default: {}
  },
  deletedLabels: {
    type: Map,
    of: String,
    default: {}
  },
  lastLabelIdNum: { type: Number, default: 3, required: true },
  lastSelectedEmojiId: { type: String, default: "books-emoji", required: true },
  noteTasks: [
    {
      id: { type: String },
      classList: { type: [String] },
      content: { type: String },
      date: { type: Date, default: Date.now },
      completionDate: { type: Date }
    }
  ],
  lastTaskInputIdNum: { type: Number, default: 0 }
}, 'Notes');

module.exports = Note;