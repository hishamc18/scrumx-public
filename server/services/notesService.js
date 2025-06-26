const Note = require("../models/notesModel");
const CustomError = require('../utils/customError');

// Create a Note
exports.createNoteService = async ({ userID, title, content, backgroundColor }) => {
  const note = await Note.create({ userID, title, content, backgroundColor });

  return {
    _id: note._id,
    title: note.title,
    content: note.content,
    backgroundColor: note.backgroundColor,
    createdAt: note.createdAt,
  };
};


//get user's full notes
exports.getUserNotesService = async (userID) => {
  return await Note.find({ userID }).sort({ createdAt: -1 });
};


// Update a Note
exports.updateNoteService = async ({ noteID, userID, title, content, backgroundColor }) => {
  const note = await Note.findOne({ _id: noteID, userID });

  if (!note) throw new CustomError("Note not found or unauthorized", 404);

  note.title = title || note.title;
  note.content = content || note.content;
  note.backgroundColor = backgroundColor || note.backgroundColor;

  await note.save();

  return {
    _id: note._id,
    title: note.title,
    content: note.content,
    backgroundColor: note.backgroundColor,
    updatedAt: note.updatedAt,
  };
};

// Delete a Note
exports.deleteNoteService = async ({ noteID, userID }) => {
  const note = await Note.findOneAndDelete({ _id: noteID, userID });

  if (!note) throw new CustomError("Note not found or unauthorized", 404);

  return true;
};
