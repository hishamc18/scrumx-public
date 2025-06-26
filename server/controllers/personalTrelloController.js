const asyncHandler = require("../utils/asyncHandler");
const PersonalTrello = require("../models/personalTrelloModel");
const { createTrelloServices, fetchTasksService, fetchStatusService, updateTaskServices ,changeStatusServices,deleteTrelloServices,dragAndDropServices,editTaskService} = require("../services/personalTrelloServices");

// Create a Trello task
exports.CreateTrello = asyncHandler(async (req, res) => {
  const { title, category, status, priority } = req.body;
  console.log(priority,"priority")
  const userID =   req.user.id;  

  const trello = await createTrelloServices({ userID, title, category, status, priority });
  console.log(trello)
  res.status(201).json({
    message: "Trello created successfully",
    trello,
  });
});

// Fetch tasks
exports.fetchTasks = asyncHandler(async (req, res) => {  
  const userID = req.user.id;  
  const tasks = await fetchTasksService(userID);
  res.status(200).json({ success: true, tasks });
});

// Update task status
exports.updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userID = req.user.id;  

  const task = await updateTaskServices(userID, taskId, status);
  
  res.status(200).json({ message: "Task status updated successfully", task });
});

//change status name
exports.changeStatus = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const { oldStatus, newStatus } = req.body;

  const statusUpdate = await changeStatusServices(userID, oldStatus, newStatus);

  res.status(200).json({ success: true, ...statusUpdate });
})

//delete task
 exports.deleteStatus = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const { taskId } = req.params;
  const data = await deleteTrelloServices(userID, taskId);
  if (data.deletedCount === 0) {
    return res.status(404).json({ success: false, message: "Task not found or not authorized to delete." });
  }
  res.status(200).json({ success: true, message: "Task deleted successfully", data });
});

//Drag and drop
exports.dragAndDrop = asyncHandler(async (req, res) => {
  const { taskId } = req.params; 
  const { status } = req.body;  
  const updatedTask = await dragAndDropServices(taskId, status);

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    updatedTask, 
  });
});



exports.EditTrello = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const data = req.body;

  // 🔍 Find existing task
  const existingTask = await PersonalTrello.findById(taskId);
  if (!existingTask) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  // 🛠 Preserve existing attachments
  let existingAttachments = Array.isArray(existingTask.attachment)
    ? existingTask.attachment
    : [];

  // ✅ Remove deleted attachments
  if (data.removedAttachments) {
    const removedAttachments = Array.isArray(data.removedAttachments)
      ? data.removedAttachments
      : [data.removedAttachments];

    existingAttachments = existingAttachments.filter(
      (attachment) => !removedAttachments.includes(attachment)
    );
  }

  // 📂 Handle new file uploads
  if (req.files && req.files.length > 0) {
    const newAttachments = req.files.map((file) => file.path);
    existingAttachments = [...new Set([...existingAttachments, ...newAttachments])]; // Avoid duplicates
  }
  data.attachment = existingAttachments;

  try {
    const updateData = await editTaskService(taskId, data);
    res.status(200).json({
      success: true,
      message: "Task edited successfully",
      task: updateData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
