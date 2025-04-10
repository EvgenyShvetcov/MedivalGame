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
  },
});

export const { fetchPlayerRequest, fetchPlayerSuccess, fetchPlayerFailure } =
  playerSlice.actions;

export default playerSlice.reducer;
