import { call, put, takeLatest } from "redux-saga/effects";
import { fetchPlayerRequest, fetchPlayerSuccess, fetchPlayerFailure } from ".";
import { apiSaga } from "@/services/sagaHelpers/apiSaga";
import { TYPES } from "@/services/types";
import { container } from "@/inversify.config";
import { PlayerService } from "@/services/PlayerService";
import { IPlayer } from "./types";

function* fetchPlayerSaga() {
  try {
    const playerService = container.get<PlayerService>(TYPES.PlayerService);
    const data: IPlayer = yield* apiSaga<IPlayer>(
      playerService,
      "getCurrentPlayer"
    );
    yield put(fetchPlayerSuccess(data));
  } catch (err: any) {
    yield put(fetchPlayerFailure("Ошибка загрузки игрока"));
  }
}

export function* playerSaga() {
  yield takeLatest(fetchPlayerRequest.type, fetchPlayerSaga);
}
