const asyncHandler = require("../utils/asyncHandler");
const { streamTokenService, meetInviteServie, projectScopeServices } = require("../services/streamService");

exports.tokenStreamController = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
    }
    const token = streamTokenService(userId);
    res.status(200).json({ token });
});

exports.meetInviteController = asyncHandler(async (req, res) => {
    const { projectId, inviteLink, meetingDescription, meetingDate } = req.body;
    if (!projectId) {
        res.status(400).json({ error: "projectId is not required" });
        return;
    }
    const inviteMembers = await meetInviteServie({ projectId, inviteLink, meetingDescription, meetingDate });
    res.status(200).json({ message: "Video conference invitation sent to all members successfully.", inviteMembers });
});

exports.projectScopesController = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }
    const projectScopes = await projectScopeServices(projectId);
    res.status(200).json({ projectScopes });
});
