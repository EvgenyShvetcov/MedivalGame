import { call } from "redux-saga/effects";

/**
 * Универсальная обёртка для вызова метода сервиса
 * @param context объект-сервис (например, authApi)
 * @param method имя метода (строкой)
 * @param args аргументы метода
 */
export function* apiSaga<T>(
  context: any,
  method: string,
  ...args: any[]
): Generator<unknown, T, any> {
  try {
    const response: T = yield call([context, method], ...args);
    return response;
  } catch (err) {
    throw err;
  }
}
