const projectTrello = require("../models/projectTrelloModel");
const CustomError = require("../utils/customError");
const ProjectStatus = require("../models/ProjectStatussModel");
const projectModel=require("../models/projectModel")
const mongoose=require("mongoose")
// Create a new Trello task
exports.createProjectTrelloServices = async ({ userID, title, category, status, priority, projectId }) => {
  const projectStatus = await ProjectStatus.findOne({ projectId });
  if (!projectStatus || !projectStatus.status.includes(status)) {
    throw new CustomError("Invalid status for the project", 400);
  }
  const projectMembers = await projectModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$joinedMembers" },
    { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(userID) } },
    { $project: { _id: 0, role: "$joinedMembers.role" } },
  ]);
  if (!projectMembers.length) {
    throw new CustomError("User not part of this project", 403);
  }
  if (!["Founder", "Lead"].includes(projectMembers[0].role)) {
    throw new CustomError("Only Founders or Leads can add a new column", 403);
  }
  return await projectTrello.create({ 
    assigner: userID, 
    title, 
    category, 
    status, 
    priority, 
    projectId 
  });
};

// Fetch tasks by project ID
exports.fetchTasksService = async (projectId, assigneeid) => {
  const query = { projectId };
  if (assigneeid) {
    query.assignee = assigneeid;
  }
  return await projectTrello.find(query);
};


// Assign a task to a user
exports.assigneeProjectTaskServices = async ({ assignee, assigner, taskId }) => {
  const task = await projectTrello.findById(taskId);
  if (!task) {
    throw new CustomError("Task not found", 404);
  }
  const projectId = task.projectId;
  const projectMembers = await projectModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$joinedMembers" },
    { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(assigner) } },
    { $project: { _id: 0, role: "$joinedMembers.role" } },
  ]);

  if (!projectMembers.length) {
    throw new CustomError("User not part of this project", 403);
  }
  const userRole = projectMembers[0].role;
  const isAllowed = ["Founder", "Lead"].includes(userRole) || task.assigner.toString() === assigner;
  if (!isAllowed) {
    throw new CustomError("Only Founders, Leads, or the original assigner can assign tasks", 403);
  }
  task.assignee = assignee;
  task.assigner = assigner;
  await task.save();

  return task;
};


//edit task
exports.editProjectTaskService = async (taskId, data, assigner) => {
  const task = await projectTrello.findById(taskId);
  if (!task) {
    throw new CustomError("Task not found", 404);
  }
  const projectId = task.projectId;
  const projectMembers = await projectModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$joinedMembers" },
    { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(assigner) } },
    { $project: { _id: 0, role: "$joinedMembers.role" } },
  ]);

  if (!projectMembers.length) {
    throw new CustomError("User not part of this project", 403);
  }
  const userRole = projectMembers[0].role;
  const isAllowed = ["Founder", "Lead"].includes(userRole) || task.assigner.toString() === assigner;
  
  if (!isAllowed) {
    throw new CustomError("Only Founders, Leads, or the original assigner can edit tasks", 403);
  }
  const updatedTask = await projectTrello.findByIdAndUpdate(taskId, data, {
    new: true,
    runValidators: true,
  });

  return updatedTask;
};


//delete the task
exports.deleteProjectTaskService = async (taskId, assigner) => {
  const task = await projectTrello.findById(taskId);
  if (!task) {
    throw new CustomError("Task not found", 404);
  }
  const projectId = task.projectId;
  const projectMembers = await projectModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$joinedMembers" },
    { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(assigner) } },
    { $project: { _id: 0, role: "$joinedMembers.role" } },
  ]);

  if (!projectMembers.length) {
    throw new CustomError("User not part of this project", 403);
  }
  const userRole = projectMembers[0].role;
  const isAllowed = ["Founder", "Lead"].includes(userRole) || task.assigner.toString() === assigner;
  if (!isAllowed) {
    throw new CustomError("Only Founders, Leads, or the original assigner can delete tasks", 403);
  }
  await projectTrello.findByIdAndDelete(taskId);
  return { message: "Task deleted successfully" };
};


//drag and drop project services...
exports.projectDragAndDropService = async (taskId, status, userId) => {
  const task = await projectTrello.findById(taskId);
  if (!task) {
    throw new CustomError("Task not found", 404);
  }
  const projectId = task.projectId;
  const projectStatus = await ProjectStatus.findOne({ projectId });
  if (!projectStatus || !projectStatus.status.includes(status)) {
    throw new CustomError("Invalid status for the project", 400);
  }
  const projectMembers = await projectModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$joinedMembers" },
    { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(userId) } },
    { $project: { _id: 0, role: "$joinedMembers.role" } },
  ]);

  if (!projectMembers.length) {
    throw new CustomError("User not part of this project", 403);
  }
  const userRole = projectMembers[0].role;
  const isAllowed =
    ["Founder", "Lead"].includes(userRole) || 
    task.assigner.toString() === userId || 
    task.assignee?.toString() === userId; 

  if (!isAllowed) {
    throw new CustomError("Only Founders, Leads, Assigners, or Assignees can move tasks", 403);
  }
  const updatedTask = await projectTrello.findByIdAndUpdate(
    taskId,
    { status },
    { new: true, runValidators: true }
  );

  return updatedTask;
};
