const asyncHandler = require("../utils//asyncHandler");
const CustomError = require("../utils/customError");
const {
  getProjectsService,
  createProjectService,
  JoinProjectService,
  checkInviteUserService,
  createProjectIndividualService,
  getByProjectService,
  addInviteService,
  updateProjectService,
  deleteProjectService,
  updateMemberRoleService,
  deleteMemberService,
  deleteInviteService,
} = require("../services/projectService");

const getProjectsController = async (req, res) => {
  const loginUserId = req.user.id;
  const projects = await getProjectsService(loginUserId);
  res.json({ projects });
};

//  Controller to handle project creation
const createProjectController = asyncHandler(async (req, res) => {
  const { name, description, invitedMembers, image, isGroup } = req.body;
  const creatorId = req.user.id;
  const creatorEmail = req.user.email;
  console.log("this is group");

  // Validation checks
  if (!name || !creatorId) {
    throw new CustomError("Project name and creator ID are required.", 400);
  }
  if (!description) {
    throw new CustomError("Project description is required.", 400);
  }
  if (!Array.isArray(invitedMembers) || invitedMembers.length === 0) {
    throw new CustomError("At least one member must be invited.", 400);
  }

  // Prevent inviting the creator's own email
  if (invitedMembers.includes(creatorEmail)) {
    throw new CustomError("You cannot invite yourself to the project.", 400);
  }

  const { project, inviteLink } = await createProjectService({
    name,
    description,
    invitedMembers,
    creatorId,
    image,
    isGroup,
  });

  res.status(201).json({
    message: "Project created!",
    inviteLink,
    project,
  });
});

const createProjectIndividualController = asyncHandler(async (req, res) => {
  const { name, description, image, isGroup } = req.body;
  const creatorId = req.user.id;

  // Validation checks
  if (!name || !creatorId) {
    throw new CustomError("Project name and creator ID are required.", 400);
  }
  if (!description) {
    throw new CustomError("Project description is required.", 400);
  }

  const { project } = await createProjectIndividualService({
    name,
    description,
    creatorId,
    image,
    isGroup,
  });

  res.status(201).json({
    message: "Individual Project created!",
    project,
  });
});

const joinProjectController = asyncHandler(async (req, res) => {
  const { inviteToken } = req.params;
  const email = req.user.email;
  console.log(email, "email");

  const response = await JoinProjectService(inviteToken, email);

  res.status(200).json(response);
});

// Check invite users
const checkInviteUserController = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Email is required", 400);
  }

  const user = await checkInviteUserService(email);
  console.log(user);

  if (user) {
    return res.json(user);
  } else {
    return res.json({
      firstName: "AnonX",
      lastName: "",
      email: email,
      avatar: "/Avatar.png",
    });
  }
});

// get by id project
const getByProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await getByProjectService(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.status(201).json({ project });
});

const addInviteController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const result = await addInviteService(projectId, email);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Controller Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

//edit project

const updateProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;
  const updateProject = await updateProjectService(
    name,
    description,
    projectId
  );
  res
    .status(200)
    .json({ message: "project updated successfully", updateProject });
});

//delete
const deleteProjectController = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await deleteProjectService(projectId);
  res.status(200).json({
    message: "Project deleted successfully",
    project,
  });
});

// role update
const updateMemberRoleController = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;
  const updatedProject = await updateMemberRoleService(
    projectId,
    memberId,
    role
  );

  res
    .status(200)
    .json({
      message: "Member role updated successfully",
      project: updatedProject,
    });
});

const deleteMemberController = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const project = deleteMemberService(projectId, memberId);
  res.status(200).json({ message: "Member removed successfully", project });
});

const deleteInviteColltroller = asyncHandler(async (req, res) => {
  const { projectId, email } = req.params;
  const project = await deleteInviteService(projectId, email);
  res.status(200).json({
    message: "Invite Member removed successfully",
    project,
  });
});

module.exports = {
  getProjectsController,
  createProjectController,
  createProjectIndividualController,
  joinProjectController,
  checkInviteUserController,
  getByProjectController,
  addInviteController,
  updateProjectController,
  deleteProjectController,
  updateMemberRoleController,
  deleteMemberController,
  deleteInviteColltroller,
};
