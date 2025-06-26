const mongoose = require("mongoose");

const ProjectTaskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        validate: {
          validator: function (value) {
            return !value || value >= new Date();
          },
          message: "Due date cannot be in the past.",
        },
      },
    priority: { type: String, enum: ["low", "medium", "high"] },
    status: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    attachment: [{
        type: String, 
    }],
    assigner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });
module.exports = mongoose.model("ProjectTask", ProjectTaskSchema);