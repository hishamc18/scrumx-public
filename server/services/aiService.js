const { GoogleGenerativeAI } = require("@google/generative-ai");
const aiContent = require("../models/aiModel.js");
const User = require("../models/userModel.js")
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const chatAiService = async (message, userID) => {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        // Generate AI response
        const result = await chatSession.sendMessage(message);
        const aiResponse = result.response.text();

        let chatai = await aiContent.findOne({ user: userID });

        if (!chatai) {
            chatai = new aiContent({ user: userID, conversations: [] });
        }

        // Save conversation
        chatai.conversations.push({ question: message, answer: aiResponse });
        await chatai.save();

        return aiResponse;
    } catch (error) {
        console.error("ai Service Error:", error.message);
        throw new Error("Failed to generate AI response.");
    }
};

const getAiHistoryService = async (userID) => {
    try {
        console.log(userID)
        const chatai = await aiContent.findOne({ user: userID })
        console.log(chatai)
        if (!chatai) {
            return null;
        }
        return chatai.conversations;
    } catch (error) {
        console.error("ai History Error:", error.message);
        throw new Error("Failed to fetch ai history.");
    }
};

module.exports = { chatAiService, getAiHistoryService };
