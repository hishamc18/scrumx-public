const asyncHandler = require('../utils/asyncHandler');
const { createNoteService, updateNoteService, deleteNoteService, getUserNotesService } = require("../services/notesService");

// Create a Note
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content, backgroundColor } = req.body;
  const userID = req.user.id;


  const note = await createNoteService({ userID, title, content, backgroundColor });

  res.status(201).json({
    message: "Note created successfully",
    note,
  });
});


//get use'/s full note
exports.getUserNotes = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  const notes = await getUserNotesService(userID);
  console.log(notes)
  res.status(200).json({ success: true, notes });
});



// Update a Note
exports.updateNote = asyncHandler(async (req, res) => {
  const { noteID } = req.params;
  const { title, content, backgroundColor } = req.body;
  const userID = req.user.id;

  const updatedNote = await updateNoteService({ noteID, userID, title, content, backgroundColor });

  res.status(200).json({
    message: "Note updated successfully",
    note: updatedNote,
  });
});

// Delete a Note
exports.deleteNote = asyncHandler(async (req, res) => {

  const { noteID } = req.params;
  const userID = req.user.id;


  await deleteNoteService({ noteID, userID });

  res.status(200).json({
    message: "Note deleted successfully",
  });
});
