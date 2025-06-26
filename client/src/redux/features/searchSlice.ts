import axiosInstance from "@/api/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Suggestion {
  id: string;
  name: string;
  type: string;
}

interface SearchState {
  searchTerm: string;
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: SearchState = {
  searchTerm: "",
  suggestions: [],
  loading: false,
  error: null,
};

export const fetchSuggestions = createAsyncThunk<
  Suggestion[],
  { query: string },
  { rejectValue: string }
>("search/fetchSuggestions", async ({ query }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/search?query=${query}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
        state.suggestions = [];
      })
      .addCase(
        fetchSuggestions.fulfilled,
        (state, action: PayloadAction<Suggestion[]>) => {
          state.loading = false;
          state.suggestions = action.payload;
        }
      )
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch suggestions";
      });
  },
});

export const { setSearchTerm, clearSuggestions } = searchSlice.actions;
export default searchSlice.reducer;
