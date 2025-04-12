import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlayerItem } from "./types";

interface ItemState {
  items: IPlayerItem[];
  equipped: IPlayerItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  equipped: [],
  isLoading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    fetchItemsRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchItemsSuccess(state, action: PayloadAction<IPlayerItem[]>) {
      state.items = action.payload;
      state.isLoading = false;
    },
    fetchItemsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    fetchEquippedItemsRequest(state) {
      state.isLoading = true;
    },
    fetchEquippedItemsSuccess(state, action: PayloadAction<IPlayerItem[]>) {
      state.equipped = action.payload;
      state.isLoading = false;
    },
    fetchEquippedItemsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    equipItemRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    unequipItemRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    sellItemRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    equipItemSuccess(state, _action: PayloadAction<string>) {
      state.isLoading = false;
    },
    equipItemFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    unequipItemSuccess(state, _action: PayloadAction<string>) {
      state.isLoading = false;
    },
    unequipItemFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    sellItemSuccess(state, _action: PayloadAction<string>) {
      state.isLoading = false;
    },
    sellItemFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchEquippedItemsRequest,
  fetchEquippedItemsSuccess,
  fetchEquippedItemsFailure,
  equipItemRequest,
  equipItemSuccess, // ✅
  equipItemFailure, // ✅
  unequipItemRequest,
  unequipItemSuccess, // ✅
  unequipItemFailure, // ✅
  sellItemRequest,
  sellItemSuccess, // ✅
  sellItemFailure, // ✅
} = itemSlice.actions;

export default itemSlice.reducer;
