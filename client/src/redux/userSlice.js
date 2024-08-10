import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Thunk to handle user login
export const fetchUserByLoginDetails = createAsyncThunk(
  "user/fetchUserByLoginDetails",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "An error occurred during login"
        );
      }

      toast.success("Successfully logged in", { duration: 4000 });
      return data?.data; // Return user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to check user authentication status
export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/api/v1/auth/check`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to verify authentication status"
        );
      }

      return data?.user; // Return authenticated user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to handle user logout
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "An error occurred during logout"
        );
      }

      toast.success("You are logged out 😥", { duration: 4000 });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchUserByLoginDetails
    builder
      .addCase(fetchUserByLoginDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByLoginDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserByLoginDetails.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Login failed", { duration: 4000 });
      });

    // Handle checkAuthStatus
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });

    // Handle logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Logout failed", { duration: 4000 });
      });
  },
});

export default userSlice.reducer;
