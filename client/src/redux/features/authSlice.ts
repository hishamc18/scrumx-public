// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { User } from "../types";
// import axiosInstance from "@/api/axiosInstance";
// import axios from "axios";

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   otpLoading: boolean;
//   otpError: string | null;
//   otpSuccess: boolean;
//   emailExists: boolean | null;
//   emailCheckLoading: boolean;
//   emailCheckError: string | null;
//   passwordResetSuccess: boolean;
//   passwordResetError: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
//   otpLoading: false,
//   otpError: null,
//   otpSuccess: false,
//   emailExists: null,
//   emailCheckLoading: false,
//   emailCheckError: null,
//   passwordResetSuccess: false,
//   passwordResetError: null,
// };

// // Google OAuth
// export const googleOAuth = createAsyncThunk("auth/google", async () => {
//   try {
//     window.location.href = "http://localhost:3300/api/auth/google";
//   } catch (err) {
//     console.error(err);
//   }
// });

// // Fetch New User Data
// export const getNewUserData = createAsyncThunk(
//   "auth/getNewUserData",
//   async () => {
//     try {
//       const response = await axiosInstance.get("auth/user");
//       return response.data;
//     } catch (err) {
//       throw err;
//     }
//   }
// );

// export const updateUserData = createAsyncThunk(
//   "auth/updateUserData",
//   async (userData: User,{rejectWithValue}) => {
//     try {
//       const response = await axiosInstance.post(
//         "/auth/updateProfileAndLogin",
//         userData
//       );

//       if (response.data.profileCompleted) {
//         window.location.href = "/home";
//       } else {
//         window.location.href = "/register/userCredentials";
//       }
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(error.response?.data);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const updateUserProfile = createAsyncThunk<User, FormData>(
//   "auth/myAccountUpdate",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put("auth/editUser", formData);

//       return response.data.user;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(error.response?.data);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const compareUserPassword = createAsyncThunk(
//   "auth/compareUserPassword",
//   async (currentPassword: { currentPassword: string }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(
//         "/auth/comparePassword",
//         currentPassword
//       );
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
       
//         return rejectWithValue(error.response?.data);
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const updateUserPassword = createAsyncThunk<
//   User,
//   { currentPassword: string; newPassword: string }
// >(
//   "auth/updateUserPassword",
//   async ({ currentPassword, newPassword }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put("/auth/editPassword", {
//         currentPassword,
//         newPassword,
//       });
//       return response.data.user;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(
//           error.response?.data || "Password update failed"
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Check if Email Exists
// export const checkEmailExists = createAsyncThunk(
//   "auth/checkEmailExists",
//   async (email: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/auth/check-email", { email });
//       return response.data.exists; // true or false
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(error.response?.data || "Failed to check email");
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Send OTP
// export const sendOtp = createAsyncThunk(
//   "auth/sendOtp",
//   async (email: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/auth/send-otp", { email });
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(error.response?.data || "failed to send OTP");
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Verify OTP
// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async (
//     { email, otp }: { email: string; otp: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.post("/auth/verify-otp", {
//         email,
//         otp,
//       });

//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(
//           error.response?.data || "OTP verification failed"
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Login
// export const login = createAsyncThunk(
//   "auth/login",
//   async (
//     { email, password }: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axiosInstance.post("/auth/login", {
//         email,
//         password,
//       });

//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
       
//         return rejectWithValue(error.response?.data || "Login failed");
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const forgotPassword = createAsyncThunk(
//   "auth/forgotPassword",
//   async (email: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/auth/forgot-password", {
//         email,
//       });
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(
//           error.response?.data || "Failed to send reset email"
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// // Reset Password
// export const resetPassword = createAsyncThunk(
//   "auth/resetPassword",
//   async (
//     { token, password }: { token: string; password: string },
//     { rejectWithValue }
//   ) => {
//     console.log(token, password, "slice");

//     try {
//       const response = await axiosInstance.post(
//         `/auth/reset-password/${token}`,
//         { password }
//       );
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(
//           error.response?.data || "Password update failed"
//         );
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
//   "auth/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosInstance.post("/auth/logout", {});
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
        
//         return rejectWithValue(error.response?.data || "Failed to logout");
//       }
//       return rejectWithValue("An unknown error occurred");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       //  Get New User Data
//       .addCase(getNewUserData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getNewUserData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(getNewUserData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch user data";
//       })
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       //compareUserPassword
//       .addCase(compareUserPassword.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(compareUserPassword.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//       })
//       .addCase(compareUserPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       //updateUserPassword
//       .addCase(updateUserPassword.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateUserPassword.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(updateUserPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Update User Data
//       .addCase(updateUserData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateUserData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(updateUserData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to update user data";
//       })
//       // Check Email Exists
//       .addCase(checkEmailExists.pending, (state) => {
//         state.emailCheckLoading = true;
//         state.emailCheckError = null;
//         state.emailExists = null;
//       })
//       .addCase(checkEmailExists.fulfilled, (state, action) => {
//         state.emailCheckLoading = false;
//         state.emailExists = action.payload;
//       })
//       .addCase(checkEmailExists.rejected, (state, action) => {
//         state.emailCheckLoading = false;
//         state.emailCheckError = action.payload as string;
//       })
//       // Send OTP
//       .addCase(sendOtp.pending, (state) => {
//         state.otpLoading = true;
//         state.otpError = null;
//         state.otpSuccess = false;
//       })
//       .addCase(sendOtp.fulfilled, (state) => {
//         state.otpLoading = false;
//       })
//       .addCase(sendOtp.rejected, (state, action) => {
//         state.otpLoading = false;
//         state.otpError = action.payload as string;
//       })
//       // Verify OTP
//       .addCase(verifyOtp.pending, (state) => {
//         state.otpLoading = true;
//         state.otpError = null;
//       })
//       .addCase(verifyOtp.fulfilled, (state) => {
//         state.otpLoading = false;
//         state.otpSuccess = true;
//       })
//       .addCase(verifyOtp.rejected, (state, action) => {
//         state.otpLoading = false;
//         state.otpError = action.payload as string;
//       })
//       // Forgot Password
//       .addCase(forgotPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(forgotPassword.fulfilled, (state) => {
//         state.loading = false;
//         state.passwordResetSuccess = true;
//       })
//       .addCase(forgotPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.passwordResetError = action.payload as string;
//       })
//       // Reset Password
//       .addCase(resetPassword.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(resetPassword.fulfilled, (state) => {
//         state.loading = false;
//         state.passwordResetSuccess = true;
//       })
//       .addCase(resetPassword.rejected, (state, action) => {
//         state.loading = false;
//         state.passwordResetError = action.payload as string;
//       })
//       // Logout User
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.error = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../types';
import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  otpLoading: boolean;
  otpError: string | null;
  otpSuccess: boolean;
  emailExists: boolean | null;
  emailCheckLoading: boolean;
  emailCheckError: string | null;
  passwordResetSuccess: boolean;
  passwordResetError: string | null;
}

interface UserFormValues {
  firstName: string;
  lastName: string;
  userProfession: string;
  password: string;
  confirmPassword?: string;
  email?:string
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  otpLoading: false,
  otpError: null,
  otpSuccess: false,
  emailExists: null,
  emailCheckLoading: false,
  emailCheckError: null,
  passwordResetSuccess: false,
  passwordResetError: null,
};

// Google OAuth
export const googleOAuth = createAsyncThunk('auth/google', async () => {
  try {
    window.location.href = 'https://www.scrumx.space/api/auth/google';
  } catch (err) {
    console.error(err);
  }
});

// Fetch New User Data
export const getNewUserData = createAsyncThunk('auth/getNewUserData', async () => {
  try {
    const response = await axiosInstance.get("auth/user")
    console.log(response.data)
    return response.data
  } catch (err) {
    console.error(err);
    throw err;
  }
});

export const updateUserData = createAsyncThunk('auth/updateUserData', async (userData: UserFormValues |null) => {
  try {
    console.log(userData,"hshhsjjsj")
    const response = await axiosInstance.post
      ("/auth/updateProfileAndLogin", userData)

    if (response.data.profileCompleted) {
      window.location.href = "/home";
    } else {
      window.location.href = "/register/userCredentials";
    }

  } catch (err) {
    console.log(err, "error");
  }
});


export const updateUserProfile = createAsyncThunk<User, FormData>(
  "auth/myAccountUpdate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "auth/editUser",
        formData
      );

      return response.data.user;
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(error.response?.data);
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);


export const compareUserPassword = createAsyncThunk(
  "auth/compareUserPassword",
  async (currentPassword: { currentPassword: string }, { rejectWithValue }) => {

    try {
      const response = await axiosInstance.post(
        "/auth/comparePassword",
        currentPassword
      );
      return response.data;
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(error.response?.data);
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);



export const updateUserPassword = createAsyncThunk<
  User,
  { currentPassword: string; newPassword: string }
>("auth/updateUserPassword", async ({ currentPassword, newPassword }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put("/auth/editPassword", {
      currentPassword,
      newPassword,
    });
    return response.data.user;
  }catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            
            return rejectWithValue(
              error.response?.data || "Password update failed"
            );
          }
          return rejectWithValue("An unknown error occurred");
        }
});



// Check if Email Exists
export const checkEmailExists = createAsyncThunk(
  'auth/checkEmailExists',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/check-email", { email });
      return response.data.exists; // true or false
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(error.response?.data || "Failed to check email");
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);

// Send OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/send-otp", { email });
      return response.data;
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(error.response?.data || "failed to send OTP");
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });

      return response.data;
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(
                error.response?.data || "OTP verification failed"
              );
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);

// Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });

      return response.data;
    }catch (error: unknown) {
            if (axios.isAxiosError(error)) {
             
              return rejectWithValue(error.response?.data || "Login failed");
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    }catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(
                error.response?.data || "Failed to send reset email"
              );
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    console.log(token, password, "slice");

    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(
                error.response?.data || "Password update failed"
              );
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);


export const logoutUser = createAsyncThunk<void, void, { rejectValue:string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout", {},);
    } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              
              return rejectWithValue(error.response?.data || "Failed to logout");
            }
            return rejectWithValue("An unknown error occurred");
          }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //  Get New User Data
      .addCase(getNewUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getNewUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user data";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //compareUserPassword
      .addCase(compareUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(compareUserPassword.fulfilled, (state) => {
        state.loading = false
        state.error = null 
      })
      .addCase(compareUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      //updateUserPassword
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Data
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state) => {
        state.loading = false;
        // state.user = action.payload;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user data";
      })
      // Check Email Exists
      .addCase(checkEmailExists.pending, (state) => {
        state.emailCheckLoading = true;
        state.emailCheckError = null;
        state.emailExists = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.emailCheckLoading = false;
        state.emailExists = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.emailCheckLoading = false;
        state.emailCheckError = action.payload as string;
      })
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
        state.otpSuccess = false;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.otpLoading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSuccess = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordResetError = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordResetError = action.payload as string;
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default authSlice.reducer;