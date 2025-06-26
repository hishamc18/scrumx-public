const crypto = require("crypto");

// Function to generate a 4-letter uppercase OTP
exports.generateOtp = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += letters[crypto.randomInt(0, letters.length)];
  }
  return otp;
};