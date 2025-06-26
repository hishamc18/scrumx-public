const express = require("express");
const { aiHistory, chatWithAI } = require("../controllers/aiController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/aiChat", verifyToken, chatWithAI);
router.get("/aiHistory", verifyToken, aiHistory);

module.exports = router;
