const express = require("express");

const authRoutes = require("./authRoutes");
const notesRoutes = require("./notesRoutes");
const projectRoutes = require("./projectRoutes");
const aiRoutes = require("./aiRoutes");
const personalTrelloRoutes = require("./personalTrello");
const chatRoutes = require("./chatRoutes");
const projectTrelloRoutes=require("./projectTrelloRoutes")
const searchRoutes=require("./searchRoutes")
const streamRoutes=require("./streamRoutes")

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/", notesRoutes);
router.use("/", aiRoutes);
router.use("/projects", projectRoutes);
router.use("/", personalTrelloRoutes);
router.use("/", chatRoutes);
router.use("/project/trello",projectTrelloRoutes)
router.use("/",searchRoutes)
router.use('/stream',streamRoutes)


module.exports = router;
