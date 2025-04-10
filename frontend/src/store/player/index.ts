import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlayer, IPlayerState } from "./types";

const initialState: IPlayerState = {
  data: null,
  isLoading: false,
  error: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    fetchPlayerRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchPlayerSuccess(state, action: PayloadAction<IPlayer>) {
      state.data = action.payload;
      state.isLoading = false;
    },
    fetchPlayerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Смена локации
    changeLocationRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },
    changeLocationSuccess(state, action: PayloadAction<IPlayer>) {
      state.data = action.payload;
      state.isLoading = false;
    },
    changeLocationFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Пинг
    pingRequest() {},
    pingSuccess() {},
    pingFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // Онлайн статус
    checkOnlineRequest() {},
    checkOnlineSuccess(state, action: PayloadAction<boolean>) {
      if (state.data) {
        state.data.isOnline = action.payload;
      }
    },
    checkOnlineFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchPlayerRequest,
  fetchPlayerSuccess,
  fetchPlayerFailure,
  changeLocationRequest,
  changeLocationSuccess,
  changeLocationFailure,
  pingRequest,
  pingSuccess,
  pingFailure,
  checkOnlineRequest,
  checkOnlineSuccess,
  checkOnlineFailure,
} = playerSlice.actions;

export default playerSlice.reducer;
