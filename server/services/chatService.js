const { getIo } = require("../socket/socket");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const Project = require("../models/projectModel");

const startPrivateChat = async (projectId, userId1, userId2) => {
  let existingChat = await Chat.findOne({
    projectId,
    isGroup: false,
    members: { $all: [userId1, userId2] },
  }).populate("members", "firstName avatar userProfession"); // Populate members

  if (existingChat) return existingChat;

  const newChat = new Chat({
    projectId,
    isGroup: false,
    members: [userId1, userId2],
  });

  await newChat.save();

  // Populate members before returning
  const populatedChat = await Chat.findById(newChat._id).populate(
    "members",
    "firstName avatar userProfession"
  );

  // Emit event to notify users about new chat creation
  const io = getIo();
  io.to([userId1, userId2]).emit("chatCreated", populatedChat);

  return populatedChat;
};


const getOrCreateGroupChat = async (projectId) => {
  let groupChat = await Chat.findOne({ projectId, isGroup: true });

  if (!groupChat) {
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    groupChat = new Chat({
      projectId,
      isGroup: true,
      members: project.joinedMembers,
      groupName: `Project ${projectId} Group Chat`,
    });

    await groupChat.save();

    // Notify all members in the chat room
    const io = getIo();
    io.to(groupChat._id.toString()).emit("groupChatCreated", groupChat);
  }

  return groupChat;
};

const sendMessage = async (chatId, senderId, content, messageType = "text") => {
  const message = new Message({
    chatId,
    sender: senderId,
    content,
    messageType,
  });

  await message.save();
  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

  // Emit message to all users in the chat room
  const io = getIo();
  io.to(chatId).emit("newMessage", message);

  return message;
};

const getChatMessages = async (chatId) => {
  return await Message.find({ chatId }).populate("sender", "firstName avatar");
};

module.exports = { startPrivateChat, getOrCreateGroupChat, sendMessage, getChatMessages };
