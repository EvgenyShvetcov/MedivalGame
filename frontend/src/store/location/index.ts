import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "./types";

interface LocationState {
  data: Location[];
  isLoading: boolean;
  error: string | null;

  shops: Location[];
  arenas: Location[];
}

const initialState: LocationState = {
  data: [],
  isLoading: false,
  error: null,
  shops: [],
  arenas: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // 🔹 Получение всех
    fetchLocationsRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchLocationsSuccess(state, action: PayloadAction<Location[]>) {
      state.data = action.payload;
      state.isLoading = false;
    },
    fetchLocationsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // 🔹 Магазины
    fetchShopsRequest() {},
    fetchShopsSuccess(state, action: PayloadAction<Location[]>) {
      state.shops = action.payload;
    },
    fetchShopsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // 🔹 Арены
    fetchArenasRequest() {},
    fetchArenasSuccess(state, action: PayloadAction<Location[]>) {
      state.arenas = action.payload;
    },
    fetchArenasFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // 🔹 Создание
    createLocationRequest(_state, _action: PayloadAction<Partial<Location>>) {},
    createLocationSuccess(state, action: PayloadAction<Location>) {
      state.data.push(action.payload);
    },
    createLocationFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // 🔹 Удаление
    deleteLocationRequest(_state, _action: PayloadAction<string>) {},
    deleteLocationSuccess(state, action: PayloadAction<string>) {
      state.data = state.data.filter((loc) => loc.id !== action.payload);
    },
    deleteLocationFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchLocationsRequest,
  fetchLocationsSuccess,
  fetchLocationsFailure,
  fetchShopsRequest,
  fetchShopsSuccess,
  fetchShopsFailure,
  fetchArenasRequest,
  fetchArenasSuccess,
  fetchArenasFailure,
  createLocationRequest,
  createLocationSuccess,
  createLocationFailure,
  deleteLocationRequest,
  deleteLocationSuccess,
  deleteLocationFailure,
} = locationSlice.actions;

export default locationSlice.reducer;
