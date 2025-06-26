const ProjectStatus = require("../models/ProjectStatussModel");
const CustomError = require("../utils/customError");
const ProjectTrello = require("../models/projectTrelloModel");
const projectModel = require("../models/projectModel");
const mongoose = require("mongoose");

// Get all statuses
exports.fetchProjectStatusServices = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new CustomError("Invalid project ID format", 400);
  }

  let projectData = await ProjectStatus.findOne({
    projectId: new mongoose.Types.ObjectId(projectId),
  });

  if (!projectData || projectData.status.length === 0) {
    projectData = new ProjectStatus({
      projectId: new mongoose.Types.ObjectId(projectId),
      status: ["backlog", "in progress", "done"],
    });
    await projectData.save();
  }
  console.log(projectData.status)
  return projectData.status;
};

// Add a status
exports.addProjectStatusServices = async (projectId, userId, newStatus) => {
  const project = await projectModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
    { $unwind: "$joinedMembers" },
    { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(userId) } },
    { $project: { _id: 0, role: "$joinedMembers.role" } },
  ]);

  if (!project.length) throw new CustomError("User not part of this project", 403);
  if (!["Founder", "Lead"].includes(project[0].role)) {
    throw new CustomError("Only Founders or Leads can add a new column", 403);
  }

  const projectStatus = await ProjectStatus.findOne({ projectId });
  if (!projectStatus) {
    throw new CustomError("Project status not found", 404);
  }

  if (projectStatus.status.includes(newStatus)) {
    throw new CustomError("Status already exists", 400);
  }
  let len = projectStatus.status.length;
  projectStatus.status.splice(len-1, 0, newStatus);
  await projectStatus.save();

  return projectStatus.status;
};

// Edit project status
exports.changeProjectStatusServices = async (projectId, userId, oldStatus, newStatus) => {
    console.log(newStatus)
    const project = await projectModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
      { $unwind: "$joinedMembers" },
      { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(userId) } },
      { $project: { _id: 0, role: "$joinedMembers.role" } },
    ]);
  
    if (!project.length) throw new CustomError("User not part of this project", 403);
    if (!["Founder", "Lead"].includes(project[0].role)) {
      throw new CustomError("Only Founders or Leads can edit a status", 403);
    }
  
    const projectStatus = await ProjectStatus.findOne({ projectId });
    if (!projectStatus) {
      throw new CustomError("Project status not found", 404);
    }
  
    if (!Array.isArray(projectStatus.status)) {
      throw new CustomError("Invalid project status structure", 500);
    }
  
    if (!projectStatus.status.includes(oldStatus)) {
      throw new CustomError("Old status does not exist", 404);
    }
  
    if (projectStatus.status.includes(newStatus)) {
      throw new CustomError("New status already exists", 400);
    }
    const updatedStatuses = projectStatus.status.map((status) =>
      status === oldStatus ? newStatus : status
    );
    console.log(updatedStatuses)
    projectStatus.status = updatedStatuses
    await projectStatus.save();
    await ProjectTrello.updateMany(
      { projectId, status: oldStatus },
      { status: newStatus }
    );

    return { message: "Status updated successfully", updatedStatuses };
  };
  

//Delete project status
exports.deleteProjectStatusServices = async (userId, projectId, status) => {
    const project = await projectModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(projectId) } },
      { $unwind: "$joinedMembers" },
      { $match: { "joinedMembers.userId": new mongoose.Types.ObjectId(userId) } },
      { $project: { _id: 0, role: "$joinedMembers.role" } },
    ]);
  
    if (!project.length) throw new CustomError("User is not part of this project", 403);
    if (!["Founder", "Lead"].includes(project[0].role)) {
      throw new CustomError("Only Founders or Leads can delete a status", 403);
    }
    const projectStatus = await ProjectStatus.findOne({ projectId });
    if (!projectStatus) {
      throw new CustomError("Project status not found", 404);
    }
    if (!projectStatus.status.includes(status)) {
      throw new CustomError("Status does not exist", 400);
    }
    const updatedProjectStatus = await ProjectStatus.findOneAndUpdate(
      { projectId },
      { $pull: { status } },
      { new: true }
    );
    if (!updatedProjectStatus) {
      throw new CustomError("Status could not be deleted", 404);
    }
    await ProjectTrello.deleteMany({ projectId, status });
    return updatedProjectStatus.status;
  };