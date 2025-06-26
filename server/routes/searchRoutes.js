const express = require("express");
const { searchAllController } = require("../controllers/searchController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/search", verifyToken, searchAllController);

module.exports = router;
