import { put, takeLatest } from "redux-saga/effects";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  registerFailure,
  registerRequest,
  registerSuccess,
} from ".";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { container } from "@/inversify.config";
import { TYPES } from "@/services/types";
import { AuthService } from "@/services/AuthService";

export function* loginSaga(
  action: PayloadAction<{ username: string; password: string }>
) {
  try {
    const authService = container.get<AuthService>(TYPES.AuthService);
    const data: { accessToken: string } = yield authService.login(
      action.payload
    );

    yield put(loginSuccess({ token: data.accessToken }));
    localStorage.setItem("token", data.accessToken);
  } catch (err: any) {
    const error =
      err instanceof AxiosError
        ? err.response?.data?.message || "Ошибка авторизации"
        : "Неизвестная ошибка";
    yield put(loginFailure({ error }));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
}

export function* registerSaga(
  action: PayloadAction<{ email: string; username: string; password: string }>
) {
  try {
    const authService = container.get<AuthService>(TYPES.AuthService);
    const data: { accessToken: string } = yield authService.register(
      action.payload
    );

    yield put(registerSuccess({ token: data.accessToken }));
    localStorage.setItem("token", data.accessToken);
  } catch (err: any) {
    const error =
      err instanceof AxiosError
        ? err.response?.data?.message || "Ошибка регистрации"
        : "Неизвестная ошибка";

    yield put(registerFailure({ error }));
  }
}
