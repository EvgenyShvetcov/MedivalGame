import { call, delay, put, takeLatest } from "redux-saga/effects";
import {
  startBattleRequest,
  startBattleSuccess,
  startBattleFailure,
  makeTurnRequest,
  makeTurnSuccess,
  makeTurnFailure,
  startBotBattleSuccess,
  startBotBattleFailure,
  startBotBattleRequest,
  searchBattleSuccess,
  searchBattleFailure,
  searchBattleRequest,
  stopSearch,
  startSearch,
  cancelSearchRequest,
} from ".";
import { container } from "@/inversify.config";
import { TYPES } from "@/services/types";
import { BattleService } from "@/services/BattleService";
import { apiSaga } from "@/services/sagaHelpers/apiSaga";
import { IBattle } from "./types";
import { navigateTo } from "@/utils/navigation";

function* startBattleSaga() {
  try {
    const service = container.get<BattleService>(TYPES.BattleService);
    const data: IBattle = yield* apiSaga(service, "start");
    yield put(startBattleSuccess(data));
  } catch (err) {
    yield put(startBattleFailure("Не удалось начать бой"));
  }
}

function* makeTurnSaga(action: ReturnType<typeof makeTurnRequest>) {
  try {
    const service = container.get<BattleService>(TYPES.BattleService);
    const data: IBattle = yield* apiSaga(
      service,
      "makeTurn",
      action.payload.unitId
    );
    yield put(makeTurnSuccess(data));
  } catch (err) {
    yield put(makeTurnFailure("Ошибка хода"));
  }
}

function* startBotBattleSaga() {
  try {
    const service = container.get<BattleService>(TYPES.BattleService);
    const data: IBattle = yield* apiSaga(service, "startWithBot");
    yield put(startBotBattleSuccess(data));
    navigateTo(`/battle/${data.id}`);
  } catch (err) {
    yield put(startBotBattleFailure("Не удалось начать бой с ботом"));
  }
}

function* watchForBattle() {
  const service = container.get<BattleService>(TYPES.BattleService);
  yield put(startSearch());

  while (true) {
    yield delay(5000);

    try {
      const data: IBattle = yield call([service, service.getCurrentBattle]);

      if (data && !data.isFinished) {
        yield put(startBattleSuccess(data));
        yield put(stopSearch());
        navigateTo(`/battle/${data.id}`);
        return;
      }
    } catch {
      // просто ждём
    }
  }
}

function* searchBattleSaga() {
  try {
    const service = container.get<BattleService>(TYPES.BattleService);
    const data: IBattle = yield call([service, service.search]);

    if (data && data.id) {
      yield put(searchBattleSuccess(data));
      navigateTo(`/battle/${data.id}`);
    } else {
      yield put(searchBattleSuccess(null as any));
      yield* watchForBattle();
    }
  } catch (err) {
    yield put(searchBattleFailure("Поиск не удался"));
    yield put(stopSearch());
  }
}

function* cancelSearchSaga() {
  try {
    const service = container.get<BattleService>(TYPES.BattleService);
    yield call([service, service.cancelSearch]);
  } catch {
    // ignore
  } finally {
    yield put(stopSearch());
  }
}

export function* battleSaga() {
  yield takeLatest(startBattleRequest.type, startBattleSaga);
  yield takeLatest(makeTurnRequest.type, makeTurnSaga);
  yield takeLatest(startBotBattleRequest.type, startBotBattleSaga);
  yield takeLatest(searchBattleRequest.type, searchBattleSaga);
  yield takeLatest(cancelSearchRequest.type, cancelSearchSaga);
}
