const { sendMessage } = require("../services/chatService");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const onlineUsers = new Map(); // Store userId -> socketId(s)

const setupChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle user coming online
    socket.on("userOnline", async (userId) => {
      if (!userId) return;

      // Add socket ID to the user's list (for multiple sessions)
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
        io.emit("userStatusUpdate", { userId, isOnline: true }); // Notify all users
      }
      onlineUsers.get(userId).add(socket.id);

      console.log(`User ${userId} is online`);

      // Send the list of currently online users to the newly joined user
      socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // User joins a chat room
    socket.on("joinChat", async ({ chatId, userId }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", "Chat not found");
          return;
        }

        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);

        // Notify other users in the chat
        socket.to(chatId).emit("userJoined", { userId, chatId });
      } catch (error) {
        socket.emit("error", "Error joining chat");
      }
    });

    // Handle message sending
    socket.on("sendMessage", async ({ chatId, senderId, content, messageType = "text" }) => {
      try {
        const message = await sendMessage(chatId, senderId, content, messageType);

        // Populate sender details (firstName, lastName, avatar)
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "firstName lastName avatar")
          .lean();

        io.to(chatId).emit("newMessage", populatedMessage); // Send to all users in the chat

        console.log(`Message sent in chat ${chatId}:`, populatedMessage);
      } catch (error) {
        socket.emit("error", "Failed to send message");
        console.error(error);
      }
    });

    socket.on("userOffline", (userId) => {
      if (!userId) return;
      if (onlineUsers.has(userId)) {
          onlineUsers.delete(userId);
          io.emit("userStatusUpdate", { userId, isOnline: false });
          console.log(`User ${userId} logged out and is now offline`);
      }
  });
  

    // User leaves a chat room
    socket.on("leaveChat", ({ chatId, userId }) => {
      socket.leave(chatId);
      console.log(`User ${userId} left chat ${chatId}`);
    });

    socket.on("disconnect", () => {
      let userId = null;
  
      for (const [id, sockets] of onlineUsers.entries()) {
          if (sockets.has(socket.id)) {
              sockets.delete(socket.id);
              if (sockets.size === 0) {
                  userId = id;
                  onlineUsers.delete(id);
              }
              break;
          }
      }
  
      if (userId) {
          console.log(`User ${userId} is offline`);
          io.emit("userStatusUpdate", { userId, isOnline: false });
      }
  
      console.log(`Socket ${socket.id} disconnected`);
  });
  
  });
};

module.exports = { setupChatSocket };
