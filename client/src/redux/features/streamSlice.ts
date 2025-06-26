import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface StreamState {
    token: string;
    status: "idle" | "loading" | "failed";
    error: string | null;

}
interface InviteDetails {
    projectId: string | string[]| undefined;
    inviteLink: string;
    meetingDescription: string;
    meetingDate:string
    
    
}

const initialState: StreamState = {
    token: "",
    status: "idle",
    error: null,
   
};



const streamSlice = createSlice({
    name: "stream",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStreamToken.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchStreamToken.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(fetchStreamToken.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const fetchProjectScopes = createAsyncThunk("stream/fetchProjectScopes", async (projectId:string | undefined, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/stream/projectScopes/${projectId}`);
        console.log(response.data,"fetchProjectSkopes")
        return response.data.projectScopes;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to fetch token");
    }
});
export const fetchStreamToken = createAsyncThunk("stream/fetchTOkens", async (userId:string | undefined, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/stream/token", { userId });
        return response.data.token;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to fetch token");
    }
});

export const sendMeetingInviteLinks=createAsyncThunk("strea/sendMeetingInvitation",async({projectId,inviteLink,  meetingDescription, meetingDate}:InviteDetails,{rejectWithValue})=>{
    try{
       await axiosInstance.post('/stream/invite',{projectId,inviteLink,  meetingDescription, meetingDate})
    }catch(err){
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to invite to Meeting");
    }

})

export default streamSlice.reducer;
