const mongoose = require("mongoose");

const personalTrelloSchema = new mongoose.Schema({
  userID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
  title: { type: String, required: true },
  description:{type:String},
  dueDate: {
          type: Date,
          validate: {
            validator: function (value) {
              return !value || value >= new Date();
            },
            message: "Due date cannot be in the past.",
          },
        },
  status: { type: String, required: true }, 
  category: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"] },
  attachment: [{ type: String }],
}, { timestamps: true });

const personalTask = mongoose.model("personalTask", personalTrelloSchema);
module.exports = personalTask;

