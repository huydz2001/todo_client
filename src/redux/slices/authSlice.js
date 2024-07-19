import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refreshToken");
const initialState = {
  user: token
    ? (jwtDecode(token) ? jwtDecode(token) : null)
    : null,
  token: token ? token : null,
  refreshToken: refreshToken ? refreshToken : null,
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.token = action.payload.refreshToken;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
