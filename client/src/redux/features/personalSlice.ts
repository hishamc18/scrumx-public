import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";

interface Task {
  _id?: string; 
  title: string;
  category: string;
  status: string;
  priority: string;
  dueDate?: string;
  attachment: (string | File)[];
  projectId?: string;
  assigner?: string;
  assignee?: string;
  description?: string;
}

interface TrelloState {
  tasks: Task[];
  statuses: string[];
  loading: boolean;
  error: string | null;
}
interface addtask {
  title: string;
  category: string;
  priority: string;
  status:string;
}
// Fetch Tasks from API
export const fetchTasks = createAsyncThunk(
  "trello/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetchTasks");
      return response.data;
    } 
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to fetch tasks");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Fetch Statuses from API
export const fetchStatuses = createAsyncThunk(
  "trello/fetchStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetchStatuses");
      return response.data.statuses;
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to fetch statuses");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Add New Task
export const addTaskToTrello = createAsyncThunk(
  "trello/addTask",
  async (task: addtask, { rejectWithValue }) => {
    console.log(task);
    try {
      const response = await axiosInstance.post("/createTrello", task);
      return response.data.trello;
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to add task");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//add column
export const addColumn = createAsyncThunk(
  "trello/addColumn",
  async (trimmedColumn: string, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/addColumn`, { newStatus: trimmedColumn });
      return trimmedColumn;
    } 
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to update task status");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//rename the column
export const renameStatus = createAsyncThunk(
  "status/renameStatus",
  async (
    { oldStatus, newStatus }: { oldStatus: string; newStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch("/changeStatus", {
        oldStatus,
        newStatus,
      });
      return {
        updatedStatuses: response.data.updatedStatuses,
        oldStatus,
        newStatus,
      };
    } 
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to rename status");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//delete status
export const deleteStatus = createAsyncThunk(
  "status/deleteStatus",
  async ({ status }: { status: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/deleteStatus", {
        data: { status },
      });
      return {
        deletedStatus: status,
        updatedStatuses: response.data.updatedStatuses,
      };
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to delete status");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/deleteTrello/${taskId}`);
      return {
        deletedTaskId: taskId,
        updatedTasks: response.data.updatedTasks,
      };
    } 
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to delete task");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//drag and drop
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async (
    { taskId, newStatus }: { taskId: string; newStatus: string },
    { rejectWithValue }
  ) => {
    console.log(taskId);
    console.log(newStatus);
    try {
      const response = await axiosInstance.patch(`/dragAndDrop/${taskId}`, {
        status: newStatus,
      });
      return {
        updatedTask: response.data.updatedTask,
      };
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to update task status");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateTasks = createAsyncThunk(
  "tasks/updateTasks",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const taskId = formData.get("_id"); // Extract task ID from FormData
      const response = await axiosInstance.patch(
        `/editTask/${taskId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file uploads
          },
        }
      );
      console.log(response.data)
      return response.data.task;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to update task");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Trello Slice   updatedStatuses
const trelloSlice = createSlice({
  name: "trello",
  initialState: {
    tasks: [],
    statuses: [],
    loading: false,
    error: null,
  } as TrelloState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addColumn.fulfilled, (state, action) => {
        state.statuses.splice(state.statuses.length - 1, 0, action.payload);
      })
      .addCase(addTaskToTrello.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(renameStatus.fulfilled, (state, action) => {
        state.statuses = action.payload.updatedStatuses;
        state.tasks = state.tasks.map((task) =>
          task.status === action.payload.oldStatus
            ? { ...task, status: action.payload.newStatus }
            : task
        );
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.statuses = action.payload.updatedStatuses;
        state.tasks = state.tasks.filter(
          (task) => task.status !== action.payload.deletedStatus
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.deletedTaskId
        );
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload.updatedTask;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        state.tasks[index] = updatedTask;
      })
      .addCase(updateTasks.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task._id === updatedTask._id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
  },
});

export default trelloSlice.reducer;