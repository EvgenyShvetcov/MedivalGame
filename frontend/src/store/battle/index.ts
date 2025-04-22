import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBattleState, IBattle, IBattleLog } from "./types";

const initialState: IBattleState = {
  current: null,
  isLoading: false,
  error: null,
  isSearching: false,
  logs: [],
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

    makeTurnRequest(
      state,
      _action: PayloadAction<{ battleId: string; unitId: string }>
    ) {
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
    getBattleRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    getBattleSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    processTurnRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    processTurnSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    processTurnFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    loadLogsRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    loadLogsSuccess(state, action: PayloadAction<IBattleLog[]>) {
      state.logs = action.payload;
      state.isLoading = false;
    },
    loadLogsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    leaveBattleRequest(state) {
      state.isLoading = true;
    },
    leaveBattleSuccess(state) {
      state.current = null;
      state.isLoading = false;
    },
    leaveBattleFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    getCurrentBattleRequest(state) {
      state.isLoading = true;
    },
    getCurrentBattleSuccess(state, action: PayloadAction<IBattle>) {
      state.current = action.payload;
      state.isLoading = false;
    },
    getCurrentBattleFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    cancelSearchRequest() {},
  },
});

export const {
  getCurrentBattleRequest,
  getCurrentBattleSuccess,
  getCurrentBattleFailure,
  leaveBattleFailure,
  leaveBattleSuccess,
  leaveBattleRequest,
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
  getBattleRequest,
  getBattleSuccess,
  processTurnRequest,
  processTurnSuccess,
  processTurnFailure,
  loadLogsRequest,
  loadLogsSuccess,
  loadLogsFailure,
} = battleSlice.actions;

export default battleSlice.reducer;
