const jwt = require("jsonwebtoken");

const generateInviteToken = (projectId, invitedEmail) => {
  return jwt.sign({ projectId, invitedEmail }, process.env.PROJECT_JWT_SECRET, { expiresIn: "7d" });
};

const verifyInviteToken = (token) => {
  try {
    return jwt.verify(token, process.env.PROJECT_JWT_SECRET);
  } catch (error) {
    console.log(error)

  }
};

module.exports = { generateInviteToken, verifyInviteToken };