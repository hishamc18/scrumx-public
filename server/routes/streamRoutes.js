const express = require("express");
const { tokenStreamController ,meetInviteController,projectScopesController} = require("../controllers/streamController");

const router = express.Router();

router.post('/token',tokenStreamController)

router.post("/invite",meetInviteController)
router.get('/projectScopes/:projectId',projectScopesController)

module.exports = router;