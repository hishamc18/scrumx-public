const asyncHandler = require("../utils/asyncHandler");
const {
  fetchProjectStatusServices,
  addProjectStatusServices,
  changeProjectStatusServices,
  deleteProjectStatusServices
} = require("../services/projectStatusServices");
const CustomError=require("../utils/customError")
// import CustomError =require() "../utils/customError";
// Get project statuses
exports.fetchProjectStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const statuses = await fetchProjectStatusServices(projectId);
  res.status(200).json({ success: true, statuses });
});

// Add project status
exports.addProjectStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const { newStatus } = req.body;
  console.log(newStatus,"new status.....")
  if (!newStatus) {
    throw new CustomError("Status cannot be empty", 400);
  }

  const status = await addProjectStatusServices(projectId, userId, newStatus);
  console.log(status,"status is return from services....")
  res.status(200).json({ success: true, status });
});

// Edit project status
exports.editProjectStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { projectId } = req.params;
  const { oldStatus, newStatus } = req.body;
  const statusUpdate = await changeProjectStatusServices(projectId, userId, oldStatus, newStatus);
  res.status(200).json({ success: true, ...statusUpdate });
});

//Delete project Status
exports.deleteProjectStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { status } = req.body;
    const updatedStatuses = await deleteProjectStatusServices(userId, projectId, status);
    res.status(200).json({
      message: "Status and related tasks deleted successfully",
      updatedStatuses,
    });
  });