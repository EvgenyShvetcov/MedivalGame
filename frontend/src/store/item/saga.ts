// frontend/src/store/item/saga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { container } from "@/inversify.config";
import { TYPES } from "@/services/types";
import { ItemService } from "@/services/ItemService";
import {
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchEquippedItemsRequest,
  fetchEquippedItemsSuccess,
  fetchEquippedItemsFailure,
  equipItemRequest,
  equipItemSuccess,
  equipItemFailure,
  unequipItemRequest,
  unequipItemSuccess,
  unequipItemFailure,
  sellItemRequest,
  sellItemSuccess,
  sellItemFailure,
} from ".";

function* fetchItemsSaga() {
  try {
    const service = container.get<ItemService>(TYPES.ItemService);
    const items = yield call([service, service.getMyItems]);
    yield put(fetchItemsSuccess(items));
  } catch (err) {
    yield put(fetchItemsFailure("Не удалось загрузить предметы"));
  }
}

function* fetchEquippedItemsSaga() {
  try {
    const service = container.get<ItemService>(TYPES.ItemService);
    const items = yield call([service, service.getEquippedItems]);
    yield put(fetchEquippedItemsSuccess(items));
  } catch (err) {
    yield put(fetchEquippedItemsFailure("Не удалось загрузить экипировку"));
  }
}

function* equipItemSaga(action: ReturnType<typeof equipItemRequest>) {
  try {
    const service = container.get<ItemService>(TYPES.ItemService);
    yield call([service, service.equip], action.payload);
    yield put(equipItemSuccess(action.payload));
    yield put(fetchEquippedItemsRequest());
  } catch {
    yield put(equipItemFailure("Не удалось экипировать предмет"));
  }
}

function* unequipItemSaga(action: ReturnType<typeof unequipItemRequest>) {
  try {
    const service = container.get<ItemService>(TYPES.ItemService);
    yield call([service, service.unequip], action.payload);
    yield put(unequipItemSuccess(action.payload));
    yield put(fetchEquippedItemsRequest());
  } catch {
    yield put(unequipItemFailure("Не удалось снять предмет"));
  }
}

function* sellItemSaga(action: ReturnType<typeof sellItemRequest>) {
  try {
    const service = container.get<ItemService>(TYPES.ItemService);
    yield call([service, service.sell], action.payload);
    yield put(sellItemSuccess(action.payload));
    yield put(fetchItemsRequest());
    yield put(fetchEquippedItemsRequest());
  } catch {
    yield put(sellItemFailure("Не удалось продать предмет"));
  }
}

export function* itemSaga() {
  yield takeLatest(fetchItemsRequest.type, fetchItemsSaga);
  yield takeLatest(fetchEquippedItemsRequest.type, fetchEquippedItemsSaga);
  yield takeLatest(equipItemRequest.type, equipItemSaga);
  yield takeLatest(unequipItemRequest.type, unequipItemSaga);
  yield takeLatest(sellItemRequest.type, sellItemSaga);
}
