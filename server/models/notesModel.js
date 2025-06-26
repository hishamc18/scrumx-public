const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    backgroundColor: { type: String, default: "bg-pureWhite" },
  },
  { timestamps: true } 
);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note
