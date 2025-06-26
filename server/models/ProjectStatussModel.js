const mongoose = require("mongoose");
const projectStatusModel = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    status: [{ type: String, required: true }],
});
module.exports = mongoose.model("ProjecctStatus", projectStatusModel);