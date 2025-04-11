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
  assignAttributesFailure,
  assignAttributesSuccess,
  assignAttributesRequest,
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

function* assignAttributesSaga(
  action: ReturnType<typeof assignAttributesRequest>
) {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);

    // Отправляем изменения
    yield* apiSaga(playerService, "assignAttributes", action.payload);

    // Получаем обновлённого игрока
    const updatedPlayer: IPlayer = yield* apiSaga(
      playerService,
      "getCurrentPlayer"
    );

    yield put(assignAttributesSuccess(updatedPlayer));
  } catch (err) {
    yield put(assignAttributesFailure("Ошибка распределения характеристик"));
  }
}

// 🔹 Сменить локацию
function* changeLocationSaga(action: ReturnType<typeof changeLocationRequest>) {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);

    // сначала меняем локацию
    yield* apiSaga(playerService, "changeLocation", action.payload);

    // затем запрашиваем обновлённые данные игрока
    const updatedPlayer: IPlayer = yield* apiSaga(
      playerService,
      "getCurrentPlayer"
    );

    // и сохраняем в стор
    yield put(changeLocationSuccess(updatedPlayer));
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
  yield takeLatest(assignAttributesRequest.type, assignAttributesSaga);
  yield takeLatest(pingRequest.type, pingSaga);
  yield takeLatest(checkOnlineRequest.type, checkOnlineSaga);
}
