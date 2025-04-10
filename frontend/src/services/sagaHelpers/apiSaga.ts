import { call } from "redux-saga/effects";

/**
 * Универсальная обёртка для вызова метода сервиса
 * @param context экземпляр класса-сервиса
 * @param method имя метода сервиса
 * @param args аргументы метода
 */
export function* apiSaga<T = any>(
  context: any,
  method: string,
  ...args: any[]
): Generator<unknown, T, any> {
  const response: T = yield call([context, method], ...args);
  return response;
}
