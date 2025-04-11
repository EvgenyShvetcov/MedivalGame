import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBattleState, IBattle } from "./types";

const initialState: IBattleState = {
  current: null,
  isLoading: false,
  error: null,
  isSearching: false,
};

const battleSlice = createSlice({
  name: "battle",
  initialState,
  reducers: {
    startBattleRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    startBattleSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    startBattleFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    makeTurnRequest(state, _action: PayloadAction<{ unitId: string }>) {
      state.isLoading = true;
    },
    makeTurnSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    makeTurnFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    startBotBattleRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    startBotBattleSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    startBotBattleFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    searchBattleRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    searchBattleSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    searchBattleFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    startSearch(state) {
      state.isSearching = true;
    },
    stopSearch(state) {
      state.isSearching = false;
    },

    cancelSearchRequest() {},
  },
});

export const {
  startBattleRequest,
  startBattleSuccess,
  startBattleFailure,
  makeTurnRequest,
  makeTurnSuccess,
  makeTurnFailure,
  startBotBattleRequest,
  startBotBattleSuccess,
  startBotBattleFailure,
  searchBattleRequest,
  searchBattleSuccess,
  searchBattleFailure,
  cancelSearchRequest,
  stopSearch,
  startSearch,
} = battleSlice.actions;

export default battleSlice.reducer;
