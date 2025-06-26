const chatService = require("../services/chatService");

const startPrivateChat = async (req, res) => {
  try {
    const { projectId, userId1, userId2 } = req.body;
    const chat = await chatService.startPrivateChat(projectId, userId1, userId2);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupChat = async (req, res) => {
  try {
    const { projectId } = req.params;
    const chat = await chatService.getOrCreateGroupChat(projectId);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content, messageType } = req.body;
    const message = await chatService.sendMessage(chatId, senderId, content, messageType);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await chatService.getChatMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startPrivateChat, getGroupChat, sendMessage, getChatMessages };
