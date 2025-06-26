const express = require("express");
const {
  createProjectController,
  joinProjectController,
  checkInviteUserController,
  getProjectsController,
  createProjectIndividualController,
  getByProjectController,
  addInviteController,
  updateProjectController,
  deleteProjectController,
  updateMemberRoleController,
  deleteMemberController,
  deleteInviteColltroller,
} = require("../controllers/projectController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

// Route for creating and invite a project
router.post("/create", verifyToken, createProjectController);
router.post(
  "/individual-create",
  verifyToken,
  createProjectIndividualController
);

// join in project
router.post("/join/:inviteToken", verifyToken, joinProjectController);

// Check invite users
router.post("/check-invite-user", checkInviteUserController);

// fetching projects
router.get("/all", verifyToken, getProjectsController);
// fetch project by id
router.get("/getProjectByOne/:projectId", verifyToken, getByProjectController);
//add invitedMembers
router.post("/addInvite/:projectId", verifyToken, addInviteController);

//update project
router.patch("/updateProject/:projectId", verifyToken, updateProjectController);

//delete project
router.delete(
  "/deleteProject/:projectId",
  verifyToken,
  deleteProjectController
);
//role update
router.patch(
  "/:projectId/members/:memberId",
  verifyToken,
  updateMemberRoleController
);
//project member delete
router.delete(
  "/:projectId/members/:memberId",
  verifyToken,
  deleteMemberController
);

//project invite member delete
router.delete(
  "/:projectId/invite/:email",
  verifyToken,
  deleteInviteColltroller
);

module.exports = router;
