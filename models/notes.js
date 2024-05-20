const db = require("../db");

// Note schema
const Note = db.model("Note", {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    labels: {
      type: Map,
      of: String
    },
    lastLabelIdNum: { type: Number, default: 0 }
}, 'Notes');

module.exports = Note;