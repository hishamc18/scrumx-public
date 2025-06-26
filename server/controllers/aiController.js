const asyncHandler = require("../utils/asyncHandler");
const { chatAiService, getAiHistoryService } = require("../services/aiService");

exports.chatWithAI = asyncHandler(async (req, res) => {
    const { message } = req.body;

    const userID = req.user.id;

    if (!userID || !message) {
        res.status(400);
        throw new Error("User ID and message are required");
    }

    const response = await chatAiService(message, userID);
    res.json({ response });
});

exports.aiHistory = asyncHandler(async (req, res) => {

    const userID = req.user.id;

    const history = await getAiHistoryService(userID);
    if (!history) {
        res.status(404);
        throw new Error("No chat history found");
    }

    res.json(history);
});
