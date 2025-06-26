const cloudinary = require("cloudinary").v2;
const Task = require("../models/projectTrelloModel");
const asyncHandler = require("../utils/asyncHandler");
const { 
  createProjectTrelloServices, 
  fetchTasksService, 
  assigneeProjectTaskServices,
  editProjectTaskService,
  deleteProjectTaskService,
  projectDragAndDropService
} = require("../services/projectTrelloServices");

// Create a Trello task
exports.CreateTrello = asyncHandler(async (req, res) => {
  const { title, category, status, priority } = req.body;
  const userID = req.user.id;
  const { projectId } = req.params;
  if (!title || !status || !priority) {
    throw new CustomError("Title, status, and priority are required", 400);
  }
  const trello = await createProjectTrelloServices({ userID, title, category, status, priority, projectId });
  res.status(201).json({
    message: "Trello task created successfully",
    trello,
  });
});


// Fetch tasks
exports.fetchTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { assigneeid } = req.query; 
    const tasks = await fetchTasksService(projectId, assigneeid);
    res.status(200).json({ success: true, tasks });
});

// Assign a Trello task
exports.assigneeProjectTask = asyncHandler(async (req, res) => {
  const { assignee } = req.body;
  const assigner = req.user.id;
  const { taskId } = req.params;
  if (!assignee) {
    throw new CustomError("Assignee is required", 400);
  }
  const trello = await assigneeProjectTaskServices({ assignee, assigner, taskId });
  res.status(200).json({
    message: "Task assigned successfully",
    trello,
  });
});

exports.EditProjectTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const data = req.body;
  const assigner = req.user.id;

  const existingTask = await Task.findById(taskId);
  if (!existingTask) {
    res.status(404);
    throw new Error("Task not found");
  }

  let existingAttachments = existingTask.attachment || [];

  // Remove deleted attachments
  if (data.removedAttachments) {
    const removedAttachments = Array.isArray(data.removedAttachments)
      ? data.removedAttachments
      : [data.removedAttachments];

    existingAttachments = existingAttachments.filter(
      (attachment) => !removedAttachments.includes(attachment)
    );
  }

  // Handle new file uploads
  if (req.files && req.files.length > 0) {
    let newAttachments = [];
    for (const file of req.files) {
      const filePath = file.path;
      if (!existingAttachments.includes(filePath)) {
        newAttachments.push(filePath);
      }
    }
    existingAttachments = [...existingAttachments, ...newAttachments];
  }

  data.attachment = existingAttachments;

  const updatedTask = await editProjectTaskService(taskId, data, assigner);

  res.status(200).json({
    success: true,
    message: "Task edited successfully",
    task: updatedTask,
  });
});


//delete project task
exports.DeleteProjectTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const assigner = req.user.id;
  const result = await deleteProjectTaskService(taskId, assigner);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

//drag and drop
exports.projectDragAndDrop = asyncHandler(async (req, res) => {
  const { taskId } = req.params; 
  const { status } = req.body;
  const userId = req.user.id;
  console.log(status,"status....")
  if (!status) {
    throw new CustomError("Status is required", 400);
  }
  const updatedTask = await projectDragAndDropService(taskId, status, userId);
  console.log(updatedTask,"updated task is........")
  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    updatedTask,
  });
});

