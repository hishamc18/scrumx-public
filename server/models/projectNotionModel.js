const mongoose = require("mongoose");

const ProjectNotionSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, },
    title: { type: String, required: true },
    content: { type: String, required: true, default: "" }, 
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Notion", ProjectNotionSchema);
