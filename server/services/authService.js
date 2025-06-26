const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const bcrypt = require('bcrypt');
const sendEmail = require("../utils/sendEmail");
const { generateOtp } = require("../utils/generateOTP");
const CustomError = require("../utils/customError");
const { otpTemplate } = require("../templates/otpTemplate");
const jwt = require("jsonwebtoken")

// googleCallBack--------------------------------------------------------
exports.googleCallBackService = async (googleUser) => {
    console.log(googleUser)
    let user = await User.findOne({ email: googleUser.emails[0].value })

    if (!user) {
        user = new User({
            firstName: googleUser.name.givenName,
            lastName: googleUser.name.familyName,
            email: googleUser.emails[0].value,
            provider: googleUser.provider,
            googleId: googleUser.id,
            avatar: googleUser.photos[0].value,
            profileCompleted: false,
        });
        await user.save();
    }
    if (!user.isActive) {
        throw new CustomError("Your account is deactivated. Contact support.", 403);
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { profileCompleted: user.profileCompleted, accessToken, refreshToken }
}

// update Profile (profileCompleted:true)--------------------------------------------
exports.updateProfileAndLoginService = async ({ email, password, userProfession, firstName, lastName }) => {
    let user = await User.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    if (!user.isActive) {
        throw new CustomError("Your account is deactivated. Contact support.", 403);
    }


    if (!password || !userProfession) {
        throw new CustomError("Password and profession are required", 400);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.firstName = firstName
    user.lastName = lastName
    user.userProfession = userProfession;
    user.profileCompleted = true; // Mark profile as completed

    await user.save();

    // Generate access and refresh tokens
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { accessToken, refreshToken, user }
}

// check user exists
exports.checkEmailExistsService = async (email) => {
    const user = await User.findOne({ email });
    return user ? true : false;
};

// login using password
exports.loginUserService = async (email, password) => {
    if (!email || !password) {
        throw new CustomError("Email and password are required", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new CustomError("Invalid email or password", 401);
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { accessToken, refreshToken };
};


//sending OTP
exports.sendOtp = async (email) => {
    const otp = generateOtp();
    await Otp.create({ email, otp });

    const html = otpTemplate(otp);
    await sendEmail(email, "Your OTP for mail verification", html);

    return { message: "OTP sent successfully" };
};


//verify otp
exports.verifyOtp = async (email, enteredOtp) => {
    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) {
        throw new CustomError("OTP expired or not found");
    }

    if (otpDoc.otp !== enteredOtp) {
        throw new CustomError("Invalid OTP");
    }

    await Otp.deleteOne({ email });

    let user = await User.create({
        email,
        provider: "OTP",
    })

    user = await User.findOne({ email });

    user.avatar = "/Avatar.png"

    await user.save()

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { message: "OTP verified successfully", accessToken, refreshToken };
};



// Generate Reset Token
exports.generateResetToken = async (email) => {
    console.log(email);

    const user = await User.findOne({ email });

    if (!user) throw new CustomError("User not found", 404);

    const resetToken = await generateAccessToken(user);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    return resetToken;
};

// Reset Password Logic
exports.resetPassword = async (token, newPassword) => {
    try {

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id);


        if (!user || user.resetPasswordExpires < Date.now()) throw new CustomError("Token expired or invalid", 400);

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();


        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        return { user, accessToken, refreshToken };
    } catch (error) {
        throw new CustomError("Invalid or expired token", 400);
    }
};

exports.editUserService = async ({ firstName, lastName, userProfession, avatar, userId }) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new CustomError('User not found', 404)
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.userProfession = userProfession || user.userProfession;

    if (avatar) {
        user.avatar = avatar
    }

    await user.save();
    return user;

}

exports.compareUserPasswordService = async ({ userId, currentPassword }) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);


    if (!isPasswordValid) {
        throw new CustomError("Current password is incorrect", 400);
    }
    return { message: 'Current password is correct' };
}

exports.editPasswotdService = async ({ currentPassword, newPassword, userId }) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    if (newPassword) {
        if (!currentPassword) {
            throw new CustomError("Current password is required to update the password", 400);
        }

        if (currentPassword === newPassword) {
            throw new CustomError("New password cannot be the same as the current password", 400);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
    }

    return user
};
