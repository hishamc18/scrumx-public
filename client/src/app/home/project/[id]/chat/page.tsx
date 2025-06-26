"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { getProjectById } from "@/redux/features/projectSlice";
import { getNewUserData } from "@/redux/features/authSlice";
import {
  getOrCreateGroupChat,
  startPrivateChat,
  fetchMessages,
  addNewMessage,
  setActiveChat,
  updateUserStatus,
  setOnlineUsers,
} from "@/redux/features/chatSlice";
import { getSocket } from "@/socket/socket";
import { BiSend } from "react-icons/bi";
import { User } from "@/redux/types";
import { AppDispatch } from "@/redux/app/store";
import { useMemo } from "react";
import Loader from "@/components/Loader";

interface ProjectState {
  project: Project | null;
  loading: boolean;
}

interface AuthState {
  user: User;
  loading: boolean;
}

interface Member {
  _id: string;
  userId: {
    _id: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    userProfession?: string;
  };
}
interface Menu {
  _id: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  userProfession?: string;
}

interface Project {
  name: string;
  joinedMembers?: Member[];
}
interface ChatState {
  messagesByChat: Record<string, Message[]>;
  activeChat: {
    _id: string;
    name: string;
    participants: string[];
    isGroup?: boolean;
    members?: Menu[];
  } | null;
  loading: boolean;
  onlineUsers: Record<string, boolean>;
}

interface RootState {
  project: ProjectState;
  auth: AuthState;
  chat: ChatState;
}

interface Message {
  _id: string;
  sender: { _id: string; avatar?: string; firstName?: string } | string;
  chatId: string;
  content: string;
  createdAt: string;
}

const ChatUI: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{ id: string }>();
  const projectId = params?.id ?? "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { project, loading: projectLoading } = useSelector(
    (state: RootState) => state.project
  );
  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    messagesByChat,
    activeChat,
    loading: messagesLoading,
    onlineUsers,
  } = useSelector((state: RootState) => state.chat);

  const messages = useMemo(() => {
    return activeChat ? messagesByChat[activeChat._id] || [] : [];
  }, [activeChat, messagesByChat]);


  const [tempId, setTempId] = useState("");

  useEffect(() => {
    setTempId(`temp-${crypto.randomUUID()}`); // Generates a unique temp ID
  }, []);

  const [formattedTimes, setFormattedTimes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const times: { [key: string]: string } = messages.reduce((acc, msg) => {
      acc[msg._id] = new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return acc;
    }, {} as { [key: string]: string });

    setFormattedTimes(times);
  }, [messages]);


  useEffect(() => {
    const socket = getSocket();

    if (user?.id) {
      socket.emit("userOnline", user.id);
    }

    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    // Listen for online status updates
    socket.on("userStatusUpdate", ({ userId, isOnline }) => {
      dispatch(updateUserStatus({ userId, isOnline }));
    });

    return () => {
      socket.off("userStatusUpdate");
      socket.off("onlineUsers");
    };
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectById(projectId));
      dispatch(getNewUserData());
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    const socket = getSocket();

    // Ensure only one event listener is attached
    const handleNewMessage = (message: Message) => {
      console.log("New message received:", message);
      dispatch(addNewMessage(message));
    };

    socket.off("newMessage").on("newMessage", handleNewMessage);

    socket.on("connect", () => {
      if (activeChat) {
        socket.emit("joinChat", { chatId: activeChat._id, userId: user?.id });
      }
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("connect");
    };
  }, [dispatch, activeChat, user?.id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  if (projectLoading) return <Loader />;
  if (userLoading) return <Loader />;
  if (!project) return <p>Project not found.</p>;
  if (!user) return <p>User not found.</p>;

  const members =
    project.joinedMembers?.filter(
      (member: Member) => member?.userId?._id !== user?.id
    ) || [];

  const openChat = async (
    chatType: "group" | "individual",
    member?: Member
  ) => {
    if (
      !projectId ||
      !user?.id ||
      (chatType === "individual" && !member?.userId?._id)
    ) {
      console.error("Missing required parameters!");
      return;
    }

    let chat;
    if (chatType === "group") {
      chat = await dispatch(getOrCreateGroupChat(projectId)).unwrap();
    } else if (chatType === "individual" && member) {
      chat = await dispatch(
        startPrivateChat({
          projectId,
          userId1: user.id,
          userId2: member.userId._id,
        })
      ).unwrap();
    }

    if (chat) {
      //   dispatch(setActiveChat(chat)); // Store chat in Redux
      dispatch(fetchMessages(chat._id));
      getSocket().emit("joinChat", { chatId: chat._id, userId: user.id });
      setIsModalOpen(true);
    }
  };



  const handleSendMessage = () => {
    if (messageContent.trim() && activeChat) {
      // const tempId = `temp-${Date.now()}`;

      const newMessage = {
        _id: tempId, // Temporary ID
        chatId: activeChat._id,
        senderId: user.id,
        content: messageContent,
        tempId, // This helps identify and replace it later
      };

      // dispatch(addNewMessage(newMessage));

      getSocket().emit("sendMessage", newMessage);

      setMessageContent("");
    }
  };

  const closeModal = () => {
    if (activeChat) {
      getSocket().emit("leaveChat", { chatId: activeChat._id });
    }
    setIsModalOpen(false);
    dispatch(setActiveChat(null));
  };

  return (
    <>
      <div className="flex">
        <div className="bg-primaryDark w-full rounded-t-xl text-white p-4">
          <h2 className="text-[15px] font-bold">Chat Room</h2>

          {/* Group Chat Button */}
          <button
            className="block p-2 my-3 text-white rounded w-full text-left"
            onClick={() => openChat("group")}
          >
            <div className="flex gap-3 font-semibold text-[13px] -ml-1 items-center">
              <img
                src={"/group.png"}
                alt="Avatar"
                className="w-7 h-9 rounded-full"
              />
              {project?.name?.length > 16 ? "Group Chat" : project.name}
            </div>
          </button>

          <h3 className="text-[13px] mb-2 font-semibold text-gray-400">
            Team Mates
          </h3>
          <div className="h-[11rem] overflow-y-auto scrollbar-hidden ">
            {members.length ? (
              members.map((member: Member) => {
                const isOnline = onlineUsers[member?.userId?._id] || false;
                return (
                  <button
                    key={member?.userId?._id}
                    className="flex items-center gap-3 py-3 w-full text-left relative"
                    onClick={() => openChat("individual", member)}
                  >
                    <div className="relative">
                      <img
                        src={member?.userId?.avatar || "/Avatar.png"}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full"
                      />
                      {/* Status Indicator */}
                      <span
                        className={`absolute top-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                          isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                    </div>
                    <span className="font-semibold text-[14px] flex flex-col">
                      {member?.userId?.firstName} {member?.userId?.lastName}
                      <span className="text-[12px] font-semibold -mt-1 text-gray-400">
                        {member?.userId?.userProfession}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="text-gray-500">No members found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isModalOpen && activeChat && (
        <div className="fixed inset-0 z-50 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-[750px] max-w-full bg-[#FFFEFE] rounded-2xl shadow-lg max-h-[90vh] overflow-hidden">
            {/* Chat Header */}
            <div className="bg-primaryDark text-white p-3 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-3">
                {activeChat.isGroup ? (
                  <>
                    <img
                      src={"/group.png"}
                      alt="Group Avatar"
                      referrerPolicy="no-referrer"
                      className="w-[40px] h-[40px] rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-[15px]">
                        {project?.name}
                      </p>
                      <p className="text-[12px] text-gray-300">Group Chat</p>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={
                        activeChat?.members?.find(
                          (m: Menu) => m._id !== user.id
                        )?.avatar || "/avatar.png"
                      }
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-[40px] h-[40px] rounded-full"
                    />

                    <div>
                      <p className="font-semibold text-[15px]">
                        {activeChat.members?.find(
                          (m: Menu) => m._id !== user.id
                        )?.firstName || "Chat"}
                      </p>
                      <p className="text-[12px] text-gray-300">
                        {activeChat?.members &&
                        onlineUsers[
                          activeChat.members?.find(
                            (m) => m?._id && m._id !== user.id
                          )?._id || ""
                        ]
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                className="text-primaryDark bg-[#FEBC2F] font-bold rounded-full w-[24px] h-[24px] flex items-center justify-center"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            {/* Messages Section */}
            <div className="px-4 overflow-auto p-4 bg-pureWhite h-[400px]">
              {messagesLoading ? (
                <p>Loading messages...</p>
              ) : messages?.length > 0 ? (
                messages?.map((msg: Message) => {
                  const isSentByUser =
                    (typeof msg.sender === "object"
                      ? msg.sender?._id
                      : msg.sender) === user.id;

                  // const senderId =
                  //   typeof msg.sender === "string"
                  //     ? msg.sender
                  //     : msg.sender._id ?? "";
                  // const isSentByUser = senderId === user.id;

                  return (
                    <div
                      key={msg?._id}
                      className={`flex items-start ${
                        isSentByUser ? "justify-end" : "justify-start"
                      } mb-4`}
                    >
                      {!isSentByUser && typeof msg?.sender === "object" && (
                        <img
                          src={msg?.sender?.avatar || "/avatar.png"}
                          alt={msg?.sender?.firstName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 border border-gray-400 rounded-full mr-3"
                        />
                      )}
                      <div className="flex flex-col gap-1 mb-1">
                        {!isSentByUser && typeof msg?.sender === "object" && (
                          <p className="text-[13px] font-semibold text-black">
                            {msg?.sender?.firstName}
                          </p>
                        )}
                        <div
                          className={`px-3 py-2 max-w-[300px] text-[13px] rounded-t-lg break-words whitespace-pre-wrap ${
                            isSentByUser
                              ? "bg-[#F0EFEF] rounded-bl-lg text-right"
                              : "bg-[#D9D9D9] rounded-br-lg"
                          }`}
                        >
                          <p className="text-gray-900">{msg.content}</p>
                        </div>
                        {/* <p
                          className={`text-[10px] text-gray-500 ${
                            isSentByUser ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(msg?.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p> */}
                        <p
                          className={`text-[10px] text-gray-500 ${
                            isSentByUser ? "text-right" : "text-left"
                          }`}
                        >
                          {formattedTimes[msg._id] || "Loading..."}
                        </p>
                      </div>
                      {isSentByUser && (
                        <img
                          src={user?.avatar || "/avatar.png"}
                          alt="You"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 border border-gray-400 rounded-full ml-2"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">No messages yet.</p>
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-3 items-center p-4 border-t-2 bg-offWhite rounded-2xl">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..."
                className="border text-[14px] py-2 px-3 bg-[#D9D9D9] flex-1 rounded-3xl"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primaryDark text-white px-6 py-2 text-[20px] ml-2 rounded-3xl"
              >
                <BiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatUI;
