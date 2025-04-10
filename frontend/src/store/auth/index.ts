import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "./types";

const tokenFromStorage = localStorage.getItem("token");

const initialState: IAuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!tokenFromStorage,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(
      state,
      _action: PayloadAction<{ username: string; password: string }>
    ) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginFailure(state, action: PayloadAction<{ error: string }>) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    registerRequest(
      state,
      _action: PayloadAction<{
        email: string;
        username: string;
        password: string;
      }>
    ) {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    registerFailure(state, action: PayloadAction<{ error: string }>) {
      state.error = action.payload.error;
      state.isLoading = false;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerSuccess,
  registerFailure,
  registerRequest,
} = authSlice.actions;
export const authActions = authSlice.actions;
export default authSlice.reducer;
