import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { userId, fullName, email, role, token, expiresAt } = action.payload;
      state.user = { userId, fullName, email, role, expiresAt };
      state.token = token;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(state));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.user?.role === "Admin";
