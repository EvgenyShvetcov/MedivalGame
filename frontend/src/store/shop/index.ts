import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IShop, IShopItem } from "./types";

interface ShopState {
  shops: IShop[];
  selectedShop: IShop | null;
  items: IShopItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  shops: [],
  selectedShop: null,
  items: [],
  isLoading: false,
  error: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    fetchShopsRequest(state) {
      state.isLoading = true;
    },
    fetchShopsSuccess(state, action: PayloadAction<IShop[]>) {
      state.shops = action.payload;
      state.isLoading = false;
    },
    fetchShopsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    fetchShopByIdRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
    fetchShopByIdSuccess(state, action: PayloadAction<IShop>) {
      state.selectedShop = action.payload;
      state.items = action.payload.items;
      state.isLoading = false;
    },
    fetchShopByIdFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    buyItemRequest(state, _action: PayloadAction<string>) {
      state.isLoading = true;
    },
  },
});

export const {
  fetchShopsRequest,
  fetchShopsSuccess,
  fetchShopsFailure,
  fetchShopByIdRequest,
  fetchShopByIdSuccess,
  fetchShopByIdFailure,
  buyItemRequest,
} = shopSlice.actions;

export default shopSlice.reducer;
