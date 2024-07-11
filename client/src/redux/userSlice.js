import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  loading: false,
};

export const fetchUserByLoginDetails = createAsyncThunk(
  "users/fetchUserByLoginDetails",
  async ({ email, password }) => {
    try {
      const response = await fetch(
        "https://uniconn-chat-app-repo-ragnkphyu-kalkeshwars-projects.vercel.app/auth/login",
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
      if (response.ok) {
        toast.success("successfully loggedIn", {
          duration: 4000,
        });
        return data.data;
      } else if (response.status == 401) {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "users/checkAuthStatus",
  async () => {
    try {
      const response = await fetch(
        "https://uniconn-chat-app-repo-ragnkphyu-kalkeshwars-projects.vercel.app/auth/check",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const logout = createAsyncThunk("users/logout", async () => {
  try {
    const response = await fetch(
      "https://uniconn-chat-app-repo-ragnkphyu-kalkeshwars-projects.vercel.app/auth/logout",
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    if (response.ok) {
      toast.success("logged out successfully 😥");
    }
  } catch (error) {
    console.log(error);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserByLoginDetails.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user = action?.payload;
      state.loading = false;
    });
    builder.addCase(fetchUserByLoginDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserByLoginDetails.rejected, (state, action) => {
      console.log(action);
      state.user = null;
      state.loading = false;
    });
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.user = null;
      state.loading = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.user = null;
      state.loading = false;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
