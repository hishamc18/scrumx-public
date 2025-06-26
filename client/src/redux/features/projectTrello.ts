import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import axios from "axios";

interface Task {
  _id: string; 
  title: string;
  category: string;
  status: string;
  priority: string;
  dueDate?: string;
  attachment?: string[];
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
  projectId:string
}
// Fetch statuses from API
export const fetchStatuses = createAsyncThunk(
  "trello/fetchStatuses",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `project/trello/fetchStatus/${projectId}`
      );
      return response.data.statuses;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch statuses"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//fetch task
export const fetchProjectTasks = createAsyncThunk(
  "trello/fetchProjectTasks",
  async ({ projectId, assigneeid }: { projectId: string; assigneeid?: string | null }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/project/trello/getProjectTask/${projectId}?assigneeid=${assigneeid || ""}`
      );
      return response.data.tasks;
    }catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch tasks"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//add status of the trello
export const addStatus = createAsyncThunk(
  "trello/addStatus",
  async (
    { projectId, trimmedColumn }: { projectId: string; trimmedColumn: string },
    { rejectWithValue }
  ) => {
    try {
      await axiosInstance.patch(`/project/trello/addStatus/${projectId}`, {
        newStatus: trimmedColumn,
      });
      return trimmedColumn;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update task status"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//rename the status...
export const renameStatus = createAsyncThunk(
  "trello/renameStatus",
  async (
    {
      projectId,
      oldStatus,
      newStatus,
    }: { projectId: string; oldStatus: string; newStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/project/trello/editStatus/${projectId}`,
        {
          oldStatus,
          newStatus,
        }
      );
      return {
        updatedStatuses: response.data.updatedStatuses,
        oldStatus,
        newStatus,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to rename status"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//delete the statusss
export const deleteStatus = createAsyncThunk(
  "trello/deleteStatus",
  async (
    { projectId, status }: { projectId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/project/trello/deleteStatus/${projectId}`,
        {
          status,
        }
      );
      return {
        deletedStatus: status,
        updatedStatuses: response.data.updatedStatuses,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete status"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//delete task
export const deleteProjectTask = createAsyncThunk(
  "status/deleteProjectTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        `/project/trello/deleteProjecctTrello/${taskId}`
      );
      return taskId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete status"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//add task
export const addProjectTaskToTrello = createAsyncThunk(
  "trello/addProjectTaskToTrello",
  async (task: addtask, { rejectWithValue }) => {
    console.log(task);
    try {
      const response = await axiosInstance.post(
        `/project/trello/addTask/${task.projectId}`,
        task
      );
      console.log(response.data);
      return response.data.trello;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add task"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//edit task
export const editProjectTask = createAsyncThunk(
  "trello/editProjectTask",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const taskId = formData.get("_id"); 
      const response = await axiosInstance.patch(
        `/project/trello/editProjectTrello/${taskId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
      return response.data.task;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update task"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//drag and drop
export const DragAndDropProjectTask = createAsyncThunk(
  "tasks/DragAndDropProjectTask",
  async (
    { taskId, newStatus }: { taskId: string; newStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/project/trello/projectDragAndDrop/${taskId}`,
        { status: newStatus }
      );
      console.log(response.data)
      return response.data.updatedTask;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(
            error.response?.data?.message || "Failed to update task status"
          );
        }
        return rejectWithValue("An unknown error occurred");
      }
    }
);


//assignee 
export const assignTask = createAsyncThunk(
  "tasks/assignTask",
  async ({ taskId, assignee }: {taskId:string,assignee:string}, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(
        `/project/trello/setAssignee/${taskId}`,
        { assignee },
      );
      return {taskId,assignee}
      // return response.data;
    }catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Error assigning task"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
const projectTrelloSlice = createSlice({
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
      //project status.............
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
      .addCase(addStatus.fulfilled, (state, action) => {
        state.statuses.splice(state.statuses.length-1, 0, action.payload);
       // state.statuses.push(action.payload);
      })
      .addCase(renameStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(renameStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(renameStatus.fulfilled, (state, action) => {
        state.statuses = action.payload.updatedStatuses;
        state.tasks = state.tasks.map((task) =>
          task.status === action.payload.oldStatus
            ? { ...task, status: action.payload.newStatus }
            : task
        );
      })
      // .addCase(deleteStatus.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.statuses = action.payload.updatedStatuses;
        state.tasks = state.tasks.filter(
          (task) => task.status !== action.payload.deletedStatus
        );
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      ///project task
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProjectTaskToTrello.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteProjectTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      // .addCase(DragAndDropProjectTask.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(DragAndDropProjectTask.fulfilled, (state, action) => {
      //   const updatedTask = action.payload.updatedTask;
      //   const index = state.tasks.findIndex(
      //     (task) => task._id === updatedTask._id
      //   );
      //   state.tasks[index] = updatedTask;
      // })
      .addCase(assignTask.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action) => {
        // state.loading = false;
        const updatedTasks = state.tasks.map((task) =>
          task._id === action.payload.taskId ? { ...task, assignee: action.payload.assignee } : task
        );
        state.tasks = updatedTasks;
      })
      .addCase(assignTask.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editProjectTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
  },
});

export default projectTrelloSlice.reducer;
