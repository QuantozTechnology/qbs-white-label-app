// Copyright 2023 Quantoz Technology B.V. and contributors. Licensed
// under the Apache License, Version 2.0. See the NOTICE file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

import { IAsyncAuthStorageService, Maybe } from "./types";
import * as SecureStore from "expo-secure-store";

enum QPA_TOKEN_KEY {
  QPA_ACCESS_TOKEN = "QPA_ACCESS_TOKEN",
  QPA_REFRESH_TOKEN = "QPA_REFRESH_TOKEN",
  QPA_ID_TOKEN = "QPA_ID_TOKEN",
  QPA_TOKEN_NONCE = "QPA_TOKEN_NONCE",
}

export const authStorageService = (): IAsyncAuthStorageService => {
  async function getAccessToken(): Promise<Maybe<string>> {
    return SecureStore.getItemAsync(QPA_TOKEN_KEY.QPA_ACCESS_TOKEN);
  }

  async function getIdToken(): Promise<Maybe<string>> {
    return SecureStore.getItemAsync(QPA_TOKEN_KEY.QPA_ID_TOKEN);
  }

  async function getRefreshToken(): Promise<Maybe<string>> {
    return SecureStore.getItemAsync(QPA_TOKEN_KEY.QPA_REFRESH_TOKEN);
  }

  async function getTokenNonce(): Promise<Maybe<string>> {
    return SecureStore.getItemAsync(QPA_TOKEN_KEY.QPA_TOKEN_NONCE);
  }

  async function setAccessToken(accessToken: string): Promise<void> {
    await SecureStore.setItemAsync(QPA_TOKEN_KEY.QPA_ACCESS_TOKEN, accessToken);
  }

  async function setIdToken(idToken: string): Promise<void> {
    await SecureStore.setItemAsync(QPA_TOKEN_KEY.QPA_ID_TOKEN, idToken);
  }

  async function setRefreshToken(refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(
      QPA_TOKEN_KEY.QPA_REFRESH_TOKEN,
      refreshToken
    );
  }

  async function setTokenNonce(nonce: string): Promise<void> {
    await SecureStore.setItemAsync(QPA_TOKEN_KEY.QPA_TOKEN_NONCE, nonce);
  }

  async function clearAll(): Promise<void> {
    await SecureStore.deleteItemAsync(QPA_TOKEN_KEY.QPA_ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(QPA_TOKEN_KEY.QPA_ID_TOKEN);
    await SecureStore.deleteItemAsync(QPA_TOKEN_KEY.QPA_REFRESH_TOKEN);
  }

  return {
    getAccessToken,
    getIdToken,
    getRefreshToken,
    getTokenNonce,
    setAccessToken,
    setRefreshToken,
    setIdToken,
    setTokenNonce,
    clearAll,
  };
};
