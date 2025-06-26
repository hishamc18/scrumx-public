const mongoose = require("mongoose");

const aiSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  conversations: [
    {
      question: { type: String, required: true }, // User's question
      answer: { type: String, required: true }, // AI's response
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const aiContent = mongoose.model("aicontent", aiSchema);
module.exports = aiContent;
