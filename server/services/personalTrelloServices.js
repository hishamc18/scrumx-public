const PersonalTrello = require("../models/personalTrelloModel");
const CustomError = require("../utils/customError");
const personalStatus = require("../models/personalStatusModel");

//create new trello
exports.createTrelloServices = async ({ userID, title, category, status, priority }) => {
  const userStatus = await personalStatus.findOne({ userID });
  if (!userStatus || !userStatus.status.includes(status)) {
    throw new CustomError("Invalid status", 400);
  }
  return await PersonalTrello.create({ userID, title, category, status, priority });

};

// Fetch tasks
exports.fetchTasksService = async (userID) => {
  return await PersonalTrello.find({ userID });
};

// Update task status
exports.updateTaskServices = async (userID, taskId, status) => {
  const task = await PersonalTrello.findOne({ userID, _id: taskId });

  if (!task) throw new CustomError("Task not found", 404);

  task.status = status;
  await task.save();
  return task;
};

//edit status
exports.changeStatusServices = async (userID, oldStatus, newStatus) => {
  const userStatus = await personalStatus.findOne({ userID });
  if (!userStatus || !userStatus.status.includes(oldStatus)) {
    throw new CustomError("Invalid status", 400);
  }
  const updatedStatuses = userStatus.status.map((status) =>
    status === oldStatus ? newStatus : status
  );
  userStatus.status = updatedStatuses;
  await userStatus.save();

  await PersonalTrello.updateMany(
    { userID, status: oldStatus },
    { status: newStatus }
  );
  return { message: "Status updated successfully", updatedStatuses };
};


//delete task
exports.deleteTrelloServices = async (userID, taskId) => {
  const data = await PersonalTrello.deleteOne({ _id: taskId, userID: userID });
  return data;
};

//drag And Drop
exports.dragAndDropServices = async (taskID, status) => {
  const task = await PersonalTrello.findById(taskID);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  task.status = status;
  const updatedTask = await task.save();
  return updatedTask
}

//edit task
exports.editTaskService = async (taskID, data) => {
  const task = await PersonalTrello.findById(taskID);
  if (!task) {
    throw new Error("Task not found");
  }
  const updatedTask = await PersonalTrello.findByIdAndUpdate(taskID, data, {
    new: true,
    runValidators: true,
  });

  return updatedTask;
};
