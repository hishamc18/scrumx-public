const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, unique: true, index: true },
        googleId: { type: String },
        avatar: { type: String },
        provider: { type: String, required: true }, // "google", "OTP"
        profileCompleted: { type: Boolean, default: false }, // Track if extra credentials are completed
        password: { type: String },
        userProfession: { type: String },
        isActive: { type: Boolean, default: true },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);