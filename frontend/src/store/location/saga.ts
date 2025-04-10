import { put, takeLatest } from "redux-saga/effects";
import {
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
} from "./index";
import { container } from "@/inversify.config";
import { TYPES } from "@/services/types";
import { LocationService } from "@/services/LocationService";
import { apiSaga } from "@/services/sagaHelpers/apiSaga";
import { Location } from "./types";

// 🔹 Все локации
function* fetchLocationsSaga() {
  try {
    const service = container.get<LocationService>(TYPES.LocationService);
    const data: Location[] = yield* apiSaga(service, "getAll");
    yield put(fetchLocationsSuccess(data));
  } catch (err) {
    yield put(fetchLocationsFailure("Ошибка загрузки локаций"));
  }
}

// 🔹 Магазины
function* fetchShopsSaga() {
  try {
    const service = container.get<LocationService>(TYPES.LocationService);
    const data: Location[] = yield* apiSaga(service, "getShops");
    yield put(fetchShopsSuccess(data));
  } catch (err) {
    yield put(fetchShopsFailure("Ошибка загрузки магазинов"));
  }
}

// 🔹 Арены
function* fetchArenasSaga() {
  try {
    const service = container.get<LocationService>(TYPES.LocationService);
    const data: Location[] = yield* apiSaga(service, "getArenas");
    yield put(fetchArenasSuccess(data));
  } catch (err) {
    yield put(fetchArenasFailure("Ошибка загрузки арен"));
  }
}

// 🔹 Создание локации
function* createLocationSaga(action: ReturnType<typeof createLocationRequest>) {
  try {
    const service = container.get<LocationService>(TYPES.LocationService);
    const location: Location = yield* apiSaga(
      service,
      "createLocation",
      action.payload
    );
    yield put(createLocationSuccess(location));
  } catch (err) {
    yield put(createLocationFailure("Ошибка создания локации"));
  }
}

// 🔹 Удаление локации
function* deleteLocationSaga(action: ReturnType<typeof deleteLocationRequest>) {
  try {
    const service = container.get<LocationService>(TYPES.LocationService);
    yield* apiSaga(service, "deleteLocation", action.payload);
    yield put(deleteLocationSuccess(action.payload));
  } catch (err) {
    yield put(deleteLocationFailure("Ошибка удаления локации"));
  }
}

export function* locationSaga() {
  yield takeLatest(fetchLocationsRequest.type, fetchLocationsSaga);
  yield takeLatest(fetchShopsRequest.type, fetchShopsSaga);
  yield takeLatest(fetchArenasRequest.type, fetchArenasSaga);
  yield takeLatest(createLocationRequest.type, createLocationSaga);
  yield takeLatest(deleteLocationRequest.type, deleteLocationSaga);
}
