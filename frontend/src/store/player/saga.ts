import { put, takeLatest } from "redux-saga/effects";
import {
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
} from ".";
import { TYPES } from "@/services/types";
import { container } from "@/inversify.config";
import { PlayerService } from "@/services/PlayerService";
import { IPlayer } from "./types";
import { apiSaga } from "@/services/sagaHelpers/apiSaga";

// 🔹 Получить игрока
function* fetchPlayerSaga() {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);
    const data: IPlayer = yield* apiSaga(playerService, "getCurrentPlayer");
    yield put(fetchPlayerSuccess(data));
  } catch (err: any) {
    yield put(fetchPlayerFailure("Ошибка загрузки игрока"));
  }
}

// 🔹 Сменить локацию
function* changeLocationSaga(action: ReturnType<typeof changeLocationRequest>) {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);
    const data: IPlayer = yield* apiSaga(
      playerService,
      "changeLocation",
      action.payload
    );
    yield put(changeLocationSuccess(data));
  } catch (err) {
    yield put(changeLocationFailure("Не удалось сменить локацию"));
  }
}

// 🔹 Пинг
function* pingSaga() {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);
    yield* apiSaga(playerService, "ping");
    yield put(pingSuccess());
  } catch (err) {
    yield put(pingFailure("Ошибка пинга"));
  }
}

// 🔹 Онлайн
function* checkOnlineSaga() {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);
    const data: { online: boolean } = yield* apiSaga(
      playerService,
      "checkOnline"
    );
    yield put(checkOnlineSuccess(data.online));
  } catch (err) {
    yield put(checkOnlineFailure("Ошибка при проверке онлайна"));
  }
}

export function* playerSaga() {
  yield takeLatest(fetchPlayerRequest.type, fetchPlayerSaga);
  yield takeLatest(changeLocationRequest.type, changeLocationSaga);
  yield takeLatest(pingRequest.type, pingSaga);
  yield takeLatest(checkOnlineRequest.type, checkOnlineSaga);
}
