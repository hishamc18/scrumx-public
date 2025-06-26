// This connected stream core api
const { StreamClient } = require("@stream-io/node-sdk");
const Project = require("../models/projectModel");
const { sendConferenceInviteEmails } = require("../templates/inviteMeetTemplate");
const { json } = require("express");

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_SECRET_KEY = process.env.STREAM_SECRET_KEY;

exports.streamTokenService = (userID) => {
    if (!STREAM_API_KEY || !STREAM_SECRET_KEY) {
        throw new Error("Stream API or Secret Key is missing");
    }
    const stremClient = new StreamClient(STREAM_API_KEY, STREAM_SECRET_KEY);
    const expirationTime = Math.floor(Date.now() / 1000) + 10800;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    return stremClient.createToken(userID, expirationTime, issuedAt);
};
exports.meetInviteServie = async ({ projectId, inviteLink, meetingDescription, meetingDate }) => {
    const project = await Project.findById(projectId).populate({ path: "joinedMembers.userId", select: "firstName email" });
    const inviteMembers = project.joinedMembers.map(({ userId: { firstName, email } }) => ({ firstName, email }));
    const meetingTitle=project.name
    await sendConferenceInviteEmails(inviteMembers, inviteLink, meetingTitle, meetingDescription, meetingDate);
    console.log("✅ Conference invitations sent successfully!");
    return inviteMembers

};

exports.projectScopeServices=async(projectId)=>{
    const project = await Project.findById(projectId)
    if(!project?.joinedMembers){
        throw new Error("This project doesn't have any members");
    }
    const projectMembersIds=project.joinedMembers.map(member=>member.userId)
    const projectName=project.name
    return {projectMembersIds,projectName,projectId}
}