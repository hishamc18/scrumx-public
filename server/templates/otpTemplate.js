exports.otpTemplate = (otp) => `
  <div style="max-width: 500px; margin: auto; font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #555; text-align: center;">
    <h2 style="color: #fff; margin-bottom: 10px;">OTP Verification</h2>
    <p style="color: #ccc; font-size: 16px;">Use the OTP below to verify your email. This code will expire in <strong>5 minutes</strong>.</p>
    
    <div style="background: #fff; color: #000; padding: 15px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 15px 0; user-select: all;">
      ${otp}
    </div>

    <p style="color: #999; font-size: 14px; margin-top: 15px;">If you did not request this, please ignore this email.</p>
    <hr style="border: 0; height: 1px; background: #555; margin: 25px 0;">
    <p style="color: #777; font-size: 12px;">&copy; ${new Date().getFullYear()} ScrumX. All rights reserved.</p>
  </div>
`;
