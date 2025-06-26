const PersonalStatus = require("../models/personalStatusModel");
const CustomError = require("../utils/customError");
const PersonalTrello = require("../models/personalTrelloModel");

//get all status
exports.fetchStatusService = async (userID) => {
  let userStatus = await PersonalStatus.findOne({ userID });
  if (!userStatus || userStatus.status.length === 0) {
    userStatus = new PersonalStatus({
      userID,
      status: ["backlog", "in progress", "done"],
    });
    await userStatus.save();
  }
  return userStatus.status;
};

//add the column
exports.addStatusServices = async (userID, newStatus) => {
  let userStatus = await PersonalStatus.findOne({ userID })
  if (userStatus.status.includes(newStatus))
    CustomError("this is ocure", 401)
  else {
    let len = userStatus.status.length;
    userStatus.status.splice(len - 1, 0, newStatus)
  }

  userStatus.save()
  return userStatus.status;
}

//delete status
exports.deleteStatusServices = async (userID, status) => {
  if (!userID || !status) {
    throw new CustomError("User ID and Status are required", 400);
  }
  const updatedUserStatus = await PersonalStatus.findOneAndUpdate(
    { userID },
    { $pull: { status: status } },
    { new: true }
  );

  if (!updatedUserStatus) {
    throw new CustomError("Status not found or user does not exist", 404);
  }
  await PersonalTrello.deleteMany({ userID, status });
  return updatedUserStatus.status

}
