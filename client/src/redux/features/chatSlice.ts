import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";

// Define types
interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  tempId?: string; // Temporary ID for optimistic updates
}

interface Chat {
    _id: string;
    type: "group" | "private";
    members: {
      _id?: string;
      avatar?: string;
      firstName?: string;
      lastName?: string;
      userProfession?: string;
      email?: string;
    }[];
  }

interface ChatState {
  chats: Chat[];
  messagesByChat: Record<string, Message[]>;
  activeChat: Chat | null;
  loading: boolean;
  error: string | null;
  onlineUsers: Record<string, boolean>;
}

// Initial state
const initialState: ChatState = {
  chats: [],
  messagesByChat: {},
  activeChat: null,
  loading: false,
  onlineUsers: {},
  error: null,
};

// Async Thunks
export const getOrCreateGroupChat = createAsyncThunk<Chat, string>(
  "chat/getOrCreateGroupChat",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/group/${projectId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const startPrivateChat = createAsyncThunk<
  Chat,
  { projectId: string; userId1: string; userId2: string }
>(
  "chat/startPrivateChat",
  async ({ projectId, userId1, userId2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/start-private`, {
        projectId,
        userId1,
        userId2,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchMessages = createAsyncThunk<
  { chatId: string; messages: Message[] },
  string
>("chat/fetchMessages", async (chatId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/${chatId}/messages`);
    return { chatId, messages: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const sendMessage = createAsyncThunk<
  Message,
  { chatId: string; senderId: string; content: string }
>(
  "chat/sendMessage",
  async ({ chatId, senderId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/message`, {
        chatId,
        senderId,
        content,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Chat Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      const message = action.payload;
      const chatId = message.chatId;

      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }

      // Check if the message is a response from the server with a real `_id`
      if (message.tempId) {
        // Replace the temporary message with the real message
        state.messagesByChat[chatId] = state.messagesByChat[chatId].map((msg) =>
          msg._id === message.tempId ? message : msg
        );
      } else {
        // Remove any duplicate message where sender is just an ID string
        state.messagesByChat[chatId] = state.messagesByChat[chatId].filter(
          (msg) =>
            msg._id !== message._id &&
            !(
              msg.content === message.content &&
              typeof msg.senderId === "string"
            )
        );

        // Add the new message only if it's not already present
        state.messagesByChat[chatId].push(message);
      }
    },

    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{ userId: string; isOnline: boolean }>
    ) => {
      state.onlineUsers[action.payload.userId] = action.payload.isOnline;
    },
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      // Mark all received user IDs as online
      action.payload.forEach((userId) => {
        state.onlineUsers[userId] = true;
      });
    },
  },

  extraReducers: (builder) => {
    builder
      // Get or create group chat
      .addCase(getOrCreateGroupChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrCreateGroupChat.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChat = action.payload;
        state.chats = [
          ...state.chats.filter((chat) => chat._id !== action.payload._id),
          action.payload,
        ];
      })
      .addCase(getOrCreateGroupChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Start private chat
      .addCase(startPrivateChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startPrivateChat.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChat = action.payload;
        state.chats = [
          ...state.chats.filter((chat) => chat._id !== action.payload._id),
          action.payload,
        ];
      })
      .addCase(startPrivateChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messagesByChat[action.payload.chatId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, _id } = action.payload;

        if (!state.messagesByChat[chatId]) {
          state.messagesByChat[chatId] = [];
        }

        // Prevent duplicate message insertion
        const isDuplicate = state.messagesByChat[chatId].some(
          (msg) => msg._id === _id
        );
        if (!isDuplicate) {
          state.messagesByChat[chatId].push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  addNewMessage,
  setActiveChat,
  updateUserStatus,
  setOnlineUsers,
} = chatSlice.actions;
export default chatSlice.reducer;
