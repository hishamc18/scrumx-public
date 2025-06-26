const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { createNote, updateNote, deleteNote, getUserNotes } = require("../controllers/notesController");

const router = express.Router();

router.post("/createNote", verifyToken, createNote);
router.put("/updateNote/:noteID", verifyToken, updateNote);
router.delete("/deleteNote/:noteID", verifyToken, deleteNote);
router.get('/userNotes', verifyToken, getUserNotes);

module.exports = router;
