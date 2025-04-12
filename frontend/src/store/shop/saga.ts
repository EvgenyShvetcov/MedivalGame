import { call, put, takeLatest } from "redux-saga/effects";
import { container } from "@/inversify.config";
import { TYPES } from "@/services/types";
import { ShopService } from "@/services/ShopService";
import {
  fetchShopsRequest,
  fetchShopsSuccess,
  fetchShopsFailure,
  fetchShopByIdRequest,
  fetchShopByIdSuccess,
  fetchShopByIdFailure,
  buyItemRequest,
} from ".";

import { fetchItemsRequest, fetchEquippedItemsRequest } from "../item"; // для обновления инвентаря после покупки

function* fetchShopsSaga() {
  try {
    const service = container.get<ShopService>(TYPES.ShopService);
    const data = yield call([service, service.getAllShops]);
    yield put(fetchShopsSuccess(data));
  } catch (err) {
    yield put(fetchShopsFailure("Не удалось загрузить список магазинов"));
  }
}

function* fetchShopByIdSaga(action: ReturnType<typeof fetchShopByIdRequest>) {
  try {
    const service = container.get<ShopService>(TYPES.ShopService);
    const data = yield call([service, service.getShopById], action.payload);
    yield put(fetchShopByIdSuccess(data));
  } catch (err) {
    yield put(fetchShopByIdFailure("Не удалось загрузить магазин"));
  }
}

function* buyItemSaga(action: ReturnType<typeof buyItemRequest>) {
  try {
    const service = container.get<ShopService>(TYPES.ShopService);
    yield call([service, service.buyItem], action.payload);
    yield put(fetchItemsRequest());
    yield put(fetchEquippedItemsRequest());
  } catch (err) {
    // ты можешь добавить buyItemFailure если захочешь обрабатывать ошибку отдельно
  }
}

export function* shopSaga() {
  yield takeLatest(fetchShopsRequest.type, fetchShopsSaga);
  yield takeLatest(fetchShopByIdRequest.type, fetchShopByIdSaga);
  yield takeLatest(buyItemRequest.type, buyItemSaga);
}
