import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import auth from "./auth";
import { spawn } from "redux-saga/effects";
import { authSaga } from "./auth/saga";
import player from "./player";
import location from "./location";
import battle from "./battle";
import item from "./item";
import shop from "./shop";
import { playerSaga } from "./player/saga";
import { locationSaga } from "./location/saga";
import { battleSaga } from "./battle/saga";
import { shopSaga } from "./shop/saga";
import { itemSaga } from "./item/saga";
// import modal, { modalSaga } from "./modal";
// тут будут остальные слайсы

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth,
  player,
  location,
  battle,
  item,
  shop,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(sagaMiddleware),
});

sagaMiddleware.run(function* rootSaga() {
  yield spawn(authSaga);
  yield spawn(playerSaga);
  yield spawn(locationSaga);
  yield spawn(battleSaga);
  yield spawn(itemSaga);
  yield spawn(shopSaga);
});

export type RootState = ReturnType<typeof rootReducer>;
