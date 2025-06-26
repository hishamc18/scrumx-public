const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/start-private", chatController.startPrivateChat);
router.get("/group/:projectId", chatController.getGroupChat);
router.post("/message", chatController.sendMessage);
router.get("/:chatId/messages", chatController.getChatMessages);

module.exports = router;