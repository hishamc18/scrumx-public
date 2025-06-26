const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  fetchProjectStatus,
  addProjectStatus,
  editProjectStatus,
  deleteProjectStatus,
} = require("../controllers/projecctStatusController");
const {
  CreateTrello,
  fetchTasks,
  assigneeProjectTask,
  EditProjectTask,
  projectDragAndDrop,
  DeleteProjectTask,
} = require("../controllers/projectTrelloController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.patch("/addStatus/:projectId", verifyToken, addProjectStatus);
router.get("/fetchStatus/:projectId", verifyToken, fetchProjectStatus);
router.patch("/editStatus/:projectId", verifyToken, editProjectStatus);
router.patch("/deleteStatus/:projectId", verifyToken, deleteProjectStatus);
router.post("/addTask/:projectId", verifyToken, CreateTrello);
router.get("/getProjectTask/:projectId/", verifyToken, fetchTasks);
router.patch("/setAssignee/:taskId", verifyToken, assigneeProjectTask);

// Upload under "projectFiles"
// router.patch(
//     "/editProjectTrello/:taskId",
//     verifyToken,
//     (req, res, next) => {
//       const uploadMiddleware = upload("trelloAttachments");
//       uploadMiddleware.array("attachment", 10)(req, res, next); 
//     },
//     EditProjectTask
//   );
router.patch(
  "/editProjectTrello/:taskId",
  verifyToken,
  (req, res, next) => {
    const uploadMiddleware = upload("trelloAttachments");
    uploadMiddleware.array("attachment", 10)(req, res, next);
  },
  EditProjectTask
);

  
router.delete("/deleteProjecctTrello/:taskId", verifyToken, DeleteProjectTask);
router.patch("/projectDragAndDrop/:taskId", verifyToken, projectDragAndDrop);

module.exports = router;
