const mongoose = require("mongoose");

const PersonalstatusSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: [{ type: String, required: true }],
});

const PersonalStatus = mongoose.model("PersonalStatus", PersonalstatusSchema);


module.exports = PersonalStatus;
