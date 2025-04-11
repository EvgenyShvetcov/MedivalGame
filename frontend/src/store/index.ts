import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import auth from "./auth";
import { spawn } from "redux-saga/effects";
import { authSaga } from "./auth/saga";
import player from "./player";
import location from "./location";
import battle from "./battle";
import { playerSaga } from "./player/saga";
import { locationSaga } from "./location/saga";
import { battleSaga } from "./battle/saga";
// import modal, { modalSaga } from "./modal";
// тут будут остальные слайсы

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  auth,
  player,
  location,
  battle,
  // modal,
  // + auth, player, и т.д.
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
  // yield modalSaga();
  // + другие саги
});

export type RootState = ReturnType<typeof rootReducer>;
