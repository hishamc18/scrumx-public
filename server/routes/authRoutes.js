const express = require("express");
const passport = require("passport");
const {
    refreshTokenController, googleCallbackController, updateProfileAndLoginController,
    newUserInfoController, sendOtpController, verifyOtpController, checkEmailExistsController,
    loginUser, forgotPassword, resetPassword, editUserController, editPasswordController,
    compareUserPasswordController, logoutUser
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleCallbackController);

router.post("/updateProfileAndLogin", updateProfileAndLoginController);
router.get('/user', verifyToken, newUserInfoController);
router.post('/refresh-token', refreshTokenController);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/check-email", checkEmailExistsController);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Upload under "userAvatars"
router.put(
    '/editUser',
    verifyToken,
    (req, res, next) => {
        const uploadMiddleware = upload("users");
        uploadMiddleware.single("avatar")(req, res, next);
    },
    editUserController
);

router.post('/comparePassword', verifyToken, compareUserPasswordController);
router.put('/editPassword', verifyToken, editPasswordController);
router.post('/logout', logoutUser);

module.exports = router;
