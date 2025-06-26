const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { sendInviteEmails } = require("../templates/inviteTemplate");
const {
  generateInviteToken,
  verifyInviteToken,
} = require("../utils/contributorsInviteToken");
const CustomError = require("../utils/customError");

//  * Create a new project and generate invite links
// const getProjectsService = async (loginUserId) => {
//     const projects = await Project.find({ "joinedMembers.userId": loginUserId });
//     return projects
// };

const getProjectsService = async (loginUserId) => {
  const projects = await Project.find({
    "joinedMembers.userId": loginUserId,
    isDeleted: false,
  });
  return projects;
};

const createProjectService = async ({
  name,
  description,
  invitedMembers = [],
  creatorId,
  image,
  isGroup,
}) => {
  // Ensure required fields are present
  if (!name || !description || !creatorId) {
    throw new CustomError(
      "Project name, description, and creator ID are required.",
      400
    );
  }
  if (!Array.isArray(invitedMembers)) {
    throw new CustomError("Invited members must be an array.", 400);
  }

  // Create project
  const project = new Project({
    name,
    description,
    image,
    isGroup,
    invitedMembers,

    joinedMembers: [{ userId: creatorId, role: "Founder" }],
  });

  await project.save();

  // Generate invite token
  const inviteLinks = invitedMembers.map(async (email) => {
    const inviteToken = await generateInviteToken(project._id, email);
    if (!inviteToken) {
      throw new CustomError(
        `Failed to generate an invite token for ${email}.`,
        500
      );
    }

    return {
      email,
      inviteLink: `https://scrumx.vercel.app/invite/${inviteToken}`,
    };
  });

  // Resolve all promises
  const inviteLinksResolved = await Promise.all(inviteLinks);
  // // Send invitation emails
  // await sendInviteEmails(invitedMembers, name, description, inviteLink);
  // Send invitation emails
  await sendInviteEmails(inviteLinksResolved, name, description);
};
const createProjectIndividualService = async ({
  name,
  description,
  creatorId,
  image,
  isGroup,
}) => {
  // Ensure required fields are present
  if (!name || !description || !creatorId) {
    throw new CustomError(
      "Project name, description, and creator ID are required.",
      400
    );
  }

  // Create project
  const project = new Project({
    name,
    description,
    image,
    isGroup,
    joinedMembers: [{ userId: creatorId, role: "Founder" }],
  });

  await project.save();

  return { project };
};

const JoinProjectService = async (inviteToken, email) => {
  const decoded = await verifyInviteToken(inviteToken);
  if (!decoded || !decoded.projectId || !decoded.invitedEmail) {
    throw new CustomError("Invalid or expired invite link", 400);
  }

  const project = await Project.findById(decoded.projectId);
  if (!project) {
    throw new CustomError("Project not found", 404);
  }

  const user = await User.findOne({
    email: decoded.invitedEmail,
    profileCompleted: true,
  });
  if (!user) {
    throw new CustomError(
      "No account found. Please sign up before joining.",
      400
    );
  }

  if (decoded.invitedEmail !== email) {
    throw new CustomError(
      "Please log in with the email that received the invite link before joining.",
      403
    );
  }

  if (project.joinedMembers.some((member) => member.userId?.equals(user._id))) {
    throw new CustomError("You are already a member of this project.", 400);
  }

  // Remove from invited list & add to joined members
  project.invitedMembers = project.invitedMembers.filter(
    (invitedEmail) => invitedEmail !== email
  );
  // project.joinedMembers.push({ userId: user._id, role: "Contributor" });
  project.joinedMembers.push({
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: "Contributor",
  });

  await project.save();

  return { message: "Joined project successfully!", project };
};

// Check invite users
const checkInviteUserService = async (email) => {
  return await User.findOne({ email }).select(
    "firstName lastName email avatar profesison"
  );
};

//fetch project by id
const getByProjectService = async (projectId) => {
  try {
    const project = await Project.findById(projectId).populate({
      path: "joinedMembers.userId",
      select: "firstName lastName email avatar userProfession",
    });

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to retrieve project");
  }
};

const addInviteService = async (projectId, email) => {
  try {
    if (!email) {
      throw new CustomError("Email is required.");
    }

    // Find the project and populate joinedMembers to get user emails
    const project = await Project.findById(projectId).populate(
      "joinedMembers.userId",
      "email"
    );
    if (!project) {
      throw new CustomError("Project not found.");
    }

    console.log(
      "Joined Members:",
      project.joinedMembers.map((member) => member.userId.email)
    );

    // Check if user is already invited or joined
    const isAlreadyInvited = project.invitedMembers.includes(email);
    const isAlreadyJoined = project.joinedMembers.some(
      (member) => member.userId.email === email
    );

    if (isAlreadyInvited || isAlreadyJoined) {
      throw new CustomError("User is already invited or already joined.");
    }

    // Add email to invitedMembers
    project.invitedMembers.push(email);
    await project.save();

    // Generate invite token
    const inviteToken = await generateInviteToken(project._id, email);
    if (!inviteToken) {
      throw new CustomError(`Failed to generate an invite token for ${email}.`);
    }

    // Send invitation email
    await sendInviteEmails(
      [{ email, inviteLink: `https://scrumx.vercel.app/${inviteToken}` }],
      project.name,
      project.description
    );

    return { success: true, message: "Invitation sent successfully." };
  } catch (error) {
    console.error("Error in addInviteService:", error.message);
    throw new CustomError(error.message);
  }
};

//update project name and description
const updateProjectService = async (name, description, projectId) => {
  if (!projectId) {
    throw new CustomError("Project ID is required", 400);
  }
  const updateProject = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!updateProject) {
    throw new CustomError("Project not found", 404);
  }
  return updateProject;
};

//delete single project
const deleteProjectService = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new CustomError("Project not found");
  }
  return await Project.findByIdAndUpdate(
    projectId,
    { isDeleted: true },
    { new: true }
  );
};

const updateMemberRoleService = async (projectId, memberId, role) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new CustomError("Project not found", 404);
    }

    const member = project.joinedMembers.find(
      (m) => m.userId.toString() === memberId
    );
    if (!member) {
      throw new CustomError("Member not found", 404);
    }

    member.role = role;
    await project.save();

    return project;
  } catch (error) {
    console.error("Error updating member role:", error.message);
    throw new CustomError(error.message, 500);
  }
};

const deleteMemberService = async (projectId, memberId) => {
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { joinedMembers: { userId: memberId } } },
      { new: true }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteInviteService = async (projectId, email) => {
  try {
    const project = await Project.findById(projectId);
    console.log(project, "invite");
    if (!project) {
      throw new CustomError({ message: "Project not found" }, 404);
    }

    project.invitedMembers = project.invitedMembers.filter(
      (invitedEmail) =>
        invitedEmail.trim().toLowerCase() !== email.trim().toLowerCase()
    );

    await project.save();
    return project;
  } catch (error) {
    throw new CustomError(error.message);
  }
};

module.exports = {
  getProjectsService,
  createProjectService,
  JoinProjectService,
  checkInviteUserService,
  createProjectIndividualService,
  getByProjectService,
  addInviteService,
  updateProjectService,
  deleteProjectService,
  deleteMemberService,
  updateMemberRoleService,
  deleteInviteService,
};
