const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
    CreateTrello, updateTaskStatus, fetchTasks, changeStatus, deleteStatus,
    dragAndDrop, EditTrello
} = require("../controllers/personalTrelloController");
const { fetchStatus, addStatus, deletestatus } = require("../controllers/personalStatusContoller");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/createTrello", verifyToken, CreateTrello);
router.get("/fetchTasks", verifyToken, fetchTasks);
router.get("/fetchStatuses", verifyToken, fetchStatus);
router.patch("/updateTask/:taskId", verifyToken, updateTaskStatus);
router.patch("/addColumn", verifyToken, addStatus);
router.patch("/changeStatus", verifyToken, changeStatus);
router.delete("/deleteStatus", verifyToken, deletestatus);
router.delete("/deleteTrello/:taskId", verifyToken, deleteStatus);
router.patch("/dragAndDrop/:taskId", verifyToken, dragAndDrop);

// Upload under "trelloAttachments"

router.patch(
    "/editTask/:taskId",
    verifyToken,
    (req, res, next) => {
      const uploadMiddleware = upload("trelloAttachments");
      uploadMiddleware.array("attachment", 10)(req, res, next);
    },
    EditTrello

  );

module.exports = router;
