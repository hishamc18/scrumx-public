import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface JoinedMembers {
  userId: {
    _id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    userProfession: string;
    email: string;
  };
  role: string;
  _id: string;
}

// Define the structure of a project
interface Project {
  _id: string;
  name: string;
  description: string;
  image: string;
  isGroup: boolean;
  joinedMembers: JoinedMembers[];
  invitedMembers: string[];
}
interface createProject {
  name: string;
  description: string;
  image: string;
  isGroup: boolean;
  invitedMembers: string[];
  // joinedMembers?: Member[];
}

interface InvitedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}
// Define the initial state
interface ProjectState {
  projects: Project[];
  allProjects: Project[];
  project: Project | null;
  checkInvitedUser: InvitedUser | null;
  invitedUser: InvitedUser[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  welcomeLand: boolean;
}

const initialState: ProjectState = {
  project: null,
  projects: [],
  allProjects: [],
  checkInvitedUser: null,
  invitedUser: [],
  status: "idle",
  error: null,
  welcomeLand: false,
};

// Async thunk for creating a project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData: createProject, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/projects/create",
        projectData
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const createIndividualProject = createAsyncThunk(
  "projects/createIndividualProject",
  async (projectData: createProject, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "projects/individual-create",
        projectData
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Async thunk for Check Invite User
export const checkInviteUser = createAsyncThunk(
  "projects/checkInviteUser",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/projects/check-invite-user", {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getProjects = createAsyncThunk(
  "projects/getGroupProjects",
  async () => {
    const response = await axiosInstance.get("/projects/all");
    return response.data;
  }
);

export const joinGroupProjects = createAsyncThunk(
  "projects/joinGroupProjects",
  async (inviteToken: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/projects/join/${inviteToken}`
      );
      if (response.data.message === "User Not Found") {
        return rejectWithValue("User Not Found"); // Handle in component
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
//get projectByOne
export const getProjectById = createAsyncThunk(
  "project/getProjectById",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/projects/getProjectByOne/${projectId}`
      );
      return response.data.project;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//add invitedMembers
export const sendInvite = createAsyncThunk(
  "projects/sendInvite",
  async (
    { projectId, email }: { projectId: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/projects/addInvite/${projectId}`,
        { email }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
//updata Project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (
    { projectId, formData }: { projectId: string; formData: Project },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/projects/updateProject/${projectId}`,
        formData
      );
      return response.data; // Ensure this returns the updated project
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

//delete Project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/projects/deleteProject/${projectId}`
      );

      return { projectId, message: response.data.message };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// role update
export const updateMemberRole = createAsyncThunk(
  "projects/updateRole",
  async (
    {
      projectId,
      memberId,
      role,
    }: { projectId: string; memberId: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/projects/${projectId}/members/${memberId}`,
        { role }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// delete project member
export const deleteMember = createAsyncThunk(
  "projects/deleteMember",
  async (
    { projectId, memberId }: { projectId: string; memberId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.delete(
        `/projects/${projectId}/members/${memberId}`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteInviteMember = createAsyncThunk(
  "projects/deleteInviteMember",
  async (
    { projectId, email }: { projectId: string; email: string },
    { rejectWithValue }
  ) => {
    console.log(projectId, "deleteInviteMember");
    console.log(email, "deleteInviteMember");
    try {
      const response = await axiosInstance.delete(
        `/projects/${projectId}/invite/${email}`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addInvitedUser: (state, action: PayloadAction<string>) => {
      const latestProject = state.projects[state.projects.length - 1];
      if (latestProject) {
        latestProject.invitedMembers.push(action.payload);
      }
    },
    clearInvitedUser: (state, action) => {
      state.invitedUser = action.payload;
    },
    removeInvitedUser: (state, action: PayloadAction<string>) => {
      const latestProject = state.projects[state.projects.length - 1];
      if (latestProject) {
        latestProject.invitedMembers = latestProject.invitedMembers.filter(
          (email) => email !== action.payload
        );
      }
    },
    welcomeLand: (state, action) => {
      state.welcomeLand = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(state.status);
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Check Invite User
      .addCase(checkInviteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(checkInviteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invitedUser.push(action.payload);
      })
      .addCase(checkInviteUser.rejected, (state, action) => {
        console.error(action.payload, "API call failed");
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        console.log(action.payload, "payload");
        state.allProjects = action.payload.projects;
      })
      //get project by ID
      .addCase(getProjectById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //add project invite
      .addCase(sendInvite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendInvite.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project = action.payload;
      })
      .addCase(sendInvite.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //updateProject
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // delete Project
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.projects = state.projects.filter(
          (p) => p._id !== action.payload.projectId
        );
        state.allProjects = state.allProjects.filter(
          (p) => p._id !== action.payload.projectId
        );
        console.log(action.payload.message); // Log success message
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //update role
      .addCase(updateMemberRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.project = action.payload;
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // delete Member
      .addCase(deleteMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.project && state.project._id === action.payload.projectId) {
          state.project.joinedMembers = state.project.joinedMembers.filter(
            (member) => member.userId !== action.payload.memberId
          );
        }
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteInviteMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteInviteMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { projectId, email } = action.payload;

        // Find the project and update invitedMembers
        const project = state.projects.find((p) => p._id === projectId);
        if (project) {
          project.invitedMembers = project.invitedMembers.filter(
            (invitedEmail) =>
              invitedEmail.trim().toLowerCase() !== email.trim().toLowerCase()
          );
        }
      })
      .addCase(deleteInviteMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  addInvitedUser,
  removeInvitedUser,
  clearInvitedUser,
  welcomeLand,
} = projectSlice.actions;
export default projectSlice.reducer;
