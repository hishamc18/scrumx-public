const Otp = require("../models/otpModel");
const sendEmail = require("../utils/sendEmail");
const { generateOtp } = require("../utils/generateOTP");
const CustomError = require("../utils/customError");
const otpTemplate = require("../templates/otpTemplate");

const sendOtp = async (email) => {
  const otp = generateOtp();
  await Otp.create({ email, otp });

  const html = otpTemplate(otp);
  await sendEmail(email, "Your OTP for mail verification", otp, html);

  return { message: "OTP sent successfully" };
};

const verifyOtp = async (email, enteredOtp) => {
  const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!otpDoc) {
    throw new CustomError("OTP expired or not found");
  }

  if (otpDoc.otp !== enteredOtp) {
    throw new CustomError("Invalid OTP");
  }

  await Otp.deleteOne({ email });
  return { message: "OTP verified successfully" };
};

module.exports = { sendOtp, verifyOtp };
